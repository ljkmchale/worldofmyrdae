/**
 * World of Myrdae - Ocean Shader
 * WebGL2 animated water layer: builds a water mask from the base map image,
 * then renders flowing waves, caustic highlights, and shoreline foam on top.
 *
 * Public API:
 *   OceanShader.init(containerId, imageId, options)
 *   OceanShader.setTransform(containerId, transformStr, transformOrigin)
 *   OceanShader.destroy(containerId)
 */
const OceanShader = (function () {
    const instances = new Map();

    const DEFAULTS = {
        layerIdSuffix: '-ocean-shader',
        opacity: 1,
        // Internal render scale — 0.5 means render at half map resolution then upscale (cheaper, still smooth)
        renderScale: 0.6,
        // Visual tuning
        deepColor: [0.025, 0.12, 0.24],
        shallowColor: [0.10, 0.42, 0.58],
        foamColor: [0.58, 0.78, 0.86],
        waveSpeed: 1.0,
        // Mask threshold — pixels with score below this aren't treated as water.
        maskThreshold: 0.18
    };

    const VERTEX_SHADER = `#version 300 es
        in vec2 aPosition;
        out vec2 vUv;
        void main() {
            vUv = aPosition * 0.5 + 0.5;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;

    const FRAGMENT_SHADER = `#version 300 es
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform sampler2D uMask;
        uniform sampler2D uMap;
        uniform vec3 uDeep;
        uniform vec3 uShallow;
        uniform vec3 uFoam;
        in vec2 vUv;
        out vec4 outColor;

        // Cheap hash + value noise + 4-octave fbm.
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float vnoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }
        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
                v += a * vnoise(p);
                p *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        // Sample mask with a small dilation so we can detect shoreline a few px inland.
        float sampleMask(vec2 uv) {
            return texture(uMask, clamp(uv, vec2(0.0), vec2(1.0))).a;
        }

        void main() {
            vec2 uv = vUv;
            float mask = sampleMask(uv);
            if (mask < 0.02) discard;

            // Two scrolling, warped noise layers for layered swell.
            float t = uTime;
            vec2 warp = vec2(
                fbm(uv * 4.0 + vec2(t * 0.025, -t * 0.010)),
                fbm(uv * 4.6 + vec2(-t * 0.012, t * 0.022))
            ) - 0.5;
            vec2 wuv = uv + warp * 0.026;
            vec2 q1 = wuv * vec2(12.0, 8.0) + vec2(t * 0.026, t * 0.014);
            vec2 q2 = wuv * vec2(24.0, 16.0) + vec2(-t * 0.038, t * 0.020);
            float wave = fbm(q1) * 0.6 + fbm(q2) * 0.4;

            // Long, non-uniform swell lines. Kept soft so the map remains painterly.
            float swellA = sin((wuv.x * 22.0 + wuv.y * 10.0) + t * 0.46 + fbm(wuv * 6.0) * 5.4);
            float swellB = sin((wuv.x * -16.0 + wuv.y * 18.0) + t * 0.32 + fbm(wuv * 8.0) * 4.2);
            float ridgeBreakup = smoothstep(0.34, 0.88, fbm(wuv * 18.0 + vec2(t * 0.04, -t * 0.03)));
            float ridges = pow(max(0.0, swellA * 0.5 + 0.5), 9.0) * 0.035;
            ridges += pow(max(0.0, swellB * 0.5 + 0.5), 11.0) * 0.022;
            ridges *= ridgeBreakup * smoothstep(0.18, 0.92, mask);

            // Caustic-style bright streaks: sharpen high values.
            float caustic = pow(max(0.0, fbm(q1 * 1.4 + wave * 0.6) - 0.55), 2.2) * 2.2;

            // Depth tint based on wave height + a slow large-scale tone variation.
            float depth = fbm(uv * 2.4 + vec2(t * 0.005));
            vec3 water = mix(uDeep, uShallow, wave * 0.7 + depth * 0.3);

            // Preserve a touch of the base map's own color so coasts/lighting still read.
            vec3 base = texture(uMap, uv).rgb;
            water = mix(water, base, 0.055);

            // Sun glints / caustics.
            water += uFoam * (caustic * 0.24 + ridges);

            // Shoreline foam — sample mask at a 4-tap dilation, look for falloff.
            vec2 px = 4.0 / uResolution;
            float ml = sampleMask(uv + vec2(-px.x, 0.0));
            float mr = sampleMask(uv + vec2( px.x, 0.0));
            float mu = sampleMask(uv + vec2(0.0, -px.y));
            float md = sampleMask(uv + vec2(0.0,  px.y));
            float minN = min(min(ml, mr), min(mu, md));
            float edge = clamp(mask - minN, 0.0, 1.0);
            // Keep shoreline foam soft and broken, like surf catching light.
            float foamNoise = smoothstep(0.38, 0.88, fbm(uv * 34.0 + vec2(t * 0.06, -t * 0.025)));
            float foamDrift = 0.72 + 0.16 * fbm(uv * 18.0 + vec2(-t * 0.045, t * 0.03));
            float foam = smoothstep(0.055, 0.48, edge) * foamDrift * (0.32 + 0.42 * foamNoise);
            water += uFoam * foam * 0.48;

            outColor = vec4(water, smoothstep(0.04, 0.22, mask));
        }
    `;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function createOffscreenCanvas(width, height) {
        if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        return c;
    }

    // Score each pixel for "blue water-ness" and convert that into a shader mask.
    // and return an alpha mask canvas matching the source image dimensions.
    function buildWaterMaskCanvas(mapImg, width, height, threshold) {
        const src = createOffscreenCanvas(width, height);
        const sctx = src.getContext('2d', { willReadFrequently: true });
        sctx.drawImage(mapImg, 0, 0, width, height);
        const sdata = sctx.getImageData(0, 0, width, height);
        const sp = sdata.data;

        const out = document.createElement('canvas');
        out.width = width;
        out.height = height;
        const octx = out.getContext('2d');
        const odata = octx.createImageData(width, height);
        const op = odata.data;

        for (let i = 0; i < sp.length; i += 4) {
            const r = sp[i], g = sp[i + 1], b = sp[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;
            const blueLead = b - Math.max(r, g);
            const coolBias = b - ((r * 0.65) + (g * 0.35));
            const brightness = max / 255;

            let score = 0;
            score += clamp((blueLead + 10) / 70, 0, 1) * 0.55;
            score += clamp((coolBias + 16) / 95, 0, 1) * 0.30;
            score += clamp((sat - 0.08) / 0.45, 0, 1) * 0.15;
            if (b > 92 && g > r && brightness > 0.2 && brightness < 0.92) score += 0.15;

            const water = score < threshold ? 0 : clamp((score - threshold) / (1 - threshold), 0, 1);
            op[i] = 255;
            op[i + 1] = 255;
            op[i + 2] = 255;
            op[i + 3] = Math.round(water * 255);
        }
        octx.putImageData(odata, 0, 0);
        return out;
    }

    function compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const log = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error('OceanShader compile error: ' + log);
        }
        return shader;
    }

    function buildProgram(gl) {
        const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('OceanShader link error: ' + gl.getProgramInfoLog(program));
        }
        return program;
    }

    function uploadCanvasToTexture(gl, texture, source) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    function createInstance(container, mapImg, options) {
        const settings = { ...DEFAULTS, ...options };
        const layerId = `${container.id}${settings.layerIdSuffix}`;

        const layerGroup = document.getElementById('map-layer-group') || mapImg.parentNode;

        let layer = document.getElementById(layerId);
        if (!layer) {
            layer = document.createElement('div');
            layer.id = layerId;
            layer.className = 'ocean-shader-layer';
            layer.style.position = 'absolute';
            layer.style.top = '0';
            layer.style.left = '0';
            layer.style.width = '100%';
            layer.style.height = 'auto';
            layer.style.pointerEvents = 'none';
            layer.style.zIndex = '1';
            layer.style.opacity = String(settings.opacity);
            layer.style.mixBlendMode = 'normal';
            layer.style.contain = 'layout paint style';

            const newCanvas = document.createElement('canvas');
            newCanvas.style.position = 'absolute';
            newCanvas.style.top = '0';
            newCanvas.style.left = '0';
            newCanvas.style.width = '100%';
            newCanvas.style.height = '100%';
            newCanvas.style.pointerEvents = 'none';
            layer.appendChild(newCanvas);
            layerGroup.insertBefore(layer, mapImg.nextSibling);
        }

        const naturalW = mapImg.naturalWidth;
        const naturalH = mapImg.naturalHeight;
        const renderW = Math.max(64, Math.round(naturalW * settings.renderScale));
        const renderH = Math.max(64, Math.round(naturalH * settings.renderScale));
        const canvas = layer.querySelector('canvas');
        layer.style.aspectRatio = `${naturalW} / ${naturalH}`;
        canvas.width = renderW;
        canvas.height = renderH;

        const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, alpha: true, antialias: true });
        if (!gl) {
            console.warn('[OceanShader] WebGL2 unavailable; aborting init.');
            layer.remove();
            return null;
        }

        const program = buildProgram(gl);
        gl.useProgram(program);

        // Fullscreen quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,  1, -1,  -1, 1,
            -1,  1,  1, -1,   1, 1
        ]), gl.STATIC_DRAW);
        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'uTime');
        const uResolution = gl.getUniformLocation(program, 'uResolution');
        const uMask = gl.getUniformLocation(program, 'uMask');
        const uMap = gl.getUniformLocation(program, 'uMap');
        const uDeep = gl.getUniformLocation(program, 'uDeep');
        const uShallow = gl.getUniformLocation(program, 'uShallow');
        const uFoam = gl.getUniformLocation(program, 'uFoam');

        // Build mask + base-map textures
        const maskCanvas = buildWaterMaskCanvas(mapImg, renderW, renderH, settings.maskThreshold);
        const maskTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        uploadCanvasToTexture(gl, maskTexture, maskCanvas);

        const mapTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        uploadCanvasToTexture(gl, mapTexture, mapImg);

        gl.uniform1i(uMask, 0);
        gl.uniform1i(uMap, 1);
        gl.uniform2f(uResolution, renderW, renderH);
        gl.uniform3fv(uDeep, settings.deepColor);
        gl.uniform3fv(uShallow, settings.shallowColor);
        gl.uniform3fv(uFoam, settings.foamColor);

        gl.viewport(0, 0, renderW, renderH);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const startMs = performance.now();
        let rafId = 0;
        let stopped = false;

        function frame() {
            if (stopped) return;
            const t = (performance.now() - startMs) / 1000 * settings.waveSpeed;
            gl.uniform1f(uTime, t);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            rafId = requestAnimationFrame(frame);
        }
        frame();

        const instance = {
            layer,
            canvas,
            settings,
            stop() {
                stopped = true;
                cancelAnimationFrame(rafId);
                gl.getExtension('WEBGL_lose_context')?.loseContext();
                layer.remove();
            }
        };
        instances.set(container.id, instance);
        return instance;
    }

    function init(containerId, imageId, options = {}) {
        const container = document.getElementById(containerId);
        const mapImg = document.getElementById(imageId);
        if (!container || !mapImg) return null;

        // Kill any prior instance for this container so re-init is safe.
        destroy(containerId);

        const setup = () => createInstance(container, mapImg, options);
        if (mapImg.complete && mapImg.naturalWidth) return setup();
        mapImg.addEventListener('load', setup, { once: true });
        return null;
    }

    function destroy(containerId) {
        const inst = instances.get(containerId);
        if (!inst) return;
        inst.stop();
        instances.delete(containerId);
    }

    function setTransform(containerId, transformStr, transformOrigin = '0 0') {
        const inst = instances.get(containerId);
        if (!inst || !inst.layer) return;
        inst.layer.style.transform = transformStr;
        inst.layer.style.transformOrigin = transformOrigin;
    }

    return { init, destroy, setTransform };
})();
