const CitySceneApp = (function () {
  const state = {
    config: null,
    renderer: null,
    scene: null,
    camera: null,
    clock: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    pointer: { active: false, x: 0, y: 0 },
    keys: new Set(),
    yaw: 0,
    pitch: 0,
    velocity: new THREE.Vector3(),
    hotspotTargets: [],
    bobbers: [],
    fogPlanes: [],
    waterMaterial: null,
    tooltip: null,
    playerStart: null,
    textures: {},
    elapsed: 0
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function color(hex) {
    return new THREE.Color(hex);
  }

  function loadTexture(path, onLoad) {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
      texture.anisotropy = Math.min(8, state.renderer.capabilities.getMaxAnisotropy());
      texture.encoding = THREE.sRGBEncoding;
      if (typeof onLoad === "function") onLoad(texture);
    });
  }

  function makeCanvasTexture(size, drawFn, repeatX, repeatY) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    drawFn(ctx, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = Math.min(8, state.renderer.capabilities.getMaxAnisotropy());
    texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  function createTextures() {
    state.textures.wood = makeCanvasTexture(768, (ctx, size) => {
      const gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, "#5b3d2c");
      gradient.addColorStop(0.4, "#744d33");
      gradient.addColorStop(1, "#4d3324");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      for (let plank = 0; plank < 12; plank += 1) {
        const y = plank * (size / 12);
        ctx.fillStyle = plank % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
        ctx.fillRect(0, y, size, size / 12);
      }
      for (let i = 0; i < 2400; i += 1) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.strokeStyle = `rgba(38,24,15,${0.05 + Math.random() * 0.12})`;
        ctx.lineWidth = 0.7 + Math.random() * 2.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + 30 + Math.random() * 34,
          y + (Math.random() - 0.5) * 18,
          x + 56 + Math.random() * 34,
          y + (Math.random() - 0.5) * 20,
          x + 90 + Math.random() * 38,
          y + (Math.random() - 0.5) * 12
        );
        ctx.stroke();
      }
    }, 3.4, 3.4);

    state.textures.stone = makeCanvasTexture(768, (ctx, size) => {
      ctx.fillStyle = "#80786f";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 54) {
        for (let x = 0; x < size; x += 88) {
          const offset = (y / 54) % 2 === 0 ? 0 : 32;
          const bx = x + offset;
          const bw = 74 + Math.random() * 8;
          const bh = 40 + Math.random() * 8;
          ctx.fillStyle = `rgba(${118 + Math.floor(Math.random() * 25)},${114 + Math.floor(Math.random() * 25)},${107 + Math.floor(Math.random() * 25)},0.92)`;
          ctx.fillRect(bx, y, bw, bh);
          ctx.strokeStyle = "rgba(28,27,25,0.3)";
          ctx.strokeRect(bx, y, bw, bh);
        }
      }
      for (let i = 0; i < 8000; i += 1) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
      }
    }, 2.4, 2.4);

    state.textures.cobble = makeCanvasTexture(768, (ctx, size) => {
      ctx.fillStyle = "#6f6966";
      ctx.fillRect(0, 0, size, size);
      for (let y = 26; y < size; y += 54) {
        for (let x = 18; x < size; x += 40) {
          const wobbleX = (Math.random() - 0.5) * 8;
          const wobbleY = (Math.random() - 0.5) * 6;
          const w = 28 + Math.random() * 9;
          const h = 14 + Math.random() * 6;
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x + wobbleX, y + wobbleY, w, h, 7);
          } else {
            ctx.rect(x + wobbleX, y + wobbleY, w, h);
          }
          const base = 116 + Math.floor(Math.random() * 30);
          ctx.fillStyle = `rgba(${base},${base - 5},${base - 8},0.94)`;
          ctx.fill();
          ctx.strokeStyle = "rgba(40,40,42,0.22)";
          ctx.stroke();
        }
      }
      const wet = ctx.createLinearGradient(0, size * 0.55, 0, size);
      wet.addColorStop(0, "rgba(0,0,0,0)");
      wet.addColorStop(1, "rgba(25,38,52,0.2)");
      ctx.fillStyle = wet;
      ctx.fillRect(0, 0, size, size);
    }, 5.5, 7.5);

    state.textures.plaster = makeCanvasTexture(768, (ctx, size) => {
      ctx.fillStyle = "#b49b7b";
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 9000; i += 1) {
        const shade = 158 + Math.floor(Math.random() * 55);
        ctx.fillStyle = `rgba(${shade},${shade - 8},${shade - 18},0.05)`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 3, 2 + Math.random() * 3);
      }
      for (let i = 0; i < 140; i += 1) {
        ctx.strokeStyle = `rgba(72,54,40,${0.03 + Math.random() * 0.05})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        const x = Math.random() * size;
        const y = Math.random() * size;
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 90);
        ctx.stroke();
      }
    }, 2.8, 2.8);

    state.textures.roof = makeCanvasTexture(768, (ctx, size) => {
      ctx.fillStyle = "#334252";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 22) {
        for (let x = ((y / 22) % 2) * 16; x < size; x += 36) {
          const tone = 48 + Math.floor(Math.random() * 38);
          ctx.fillStyle = `rgba(${tone},${tone + 7},${tone + 16},0.97)`;
          ctx.fillRect(x, y, 28, 18);
          ctx.strokeStyle = "rgba(8,10,14,0.28)";
          ctx.strokeRect(x, y, 28, 18);
        }
      }
      const moss = ctx.createRadialGradient(size * 0.35, size * 0.2, 20, size * 0.35, size * 0.2, size * 0.4);
      moss.addColorStop(0, "rgba(75,92,64,0.2)");
      moss.addColorStop(1, "rgba(75,92,64,0)");
      ctx.fillStyle = moss;
      ctx.fillRect(0, 0, size, size);
    }, 2.3, 3.2);

    state.textures.rope = makeCanvasTexture(256, (ctx, size) => {
      ctx.fillStyle = "#7d6742";
      ctx.fillRect(0, 0, size, size);
      for (let i = -size; i < size * 2; i += 18) {
        ctx.strokeStyle = "rgba(120,96,60,0.9)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
        ctx.stroke();
        ctx.strokeStyle = "rgba(219,194,137,0.2)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(i + 3, 0);
        ctx.lineTo(i + size + 3, size);
        ctx.stroke();
      }
    }, 1, 1);

    state.textures.fog = makeCanvasTexture(512, (ctx, size) => {
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(220,230,240,0.55)");
      gradient.addColorStop(0.42, "rgba(190,205,220,0.18)");
      gradient.addColorStop(1, "rgba(190,205,220,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }, 1, 1);
  }

  function buildSky(scene) {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(960, 48, 24),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: color("#15233a") },
          midColor: { value: color("#354a64") },
          horizonColor: { value: color("#7f91a1") },
          warmColor: { value: color("#d6a174") }
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 horizonColor;
          uniform vec3 warmColor;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y * 0.5 + 0.5;
            vec3 base = mix(horizonColor, midColor, smoothstep(0.0, 0.45, h));
            base = mix(base, topColor, smoothstep(0.45, 1.0, h));
            float warm = smoothstep(0.0, 0.22, 1.0 - h) * smoothstep(0.15, 0.8, normalize(vWorldPos).x * 0.5 + 0.5);
            base += warmColor * warm * 0.28;
            gl_FragColor = vec4(base, 1.0);
          }
        `
      })
    );
    scene.add(sky);

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(12, 28, 28),
      new THREE.MeshBasicMaterial({ color: "#f0e7c7" })
    );
    moon.position.set(260, 210, -480);
    scene.add(moon);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 950;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 720;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.52;
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius + 180;
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({
      color: "#eef3ff",
      size: 1.6,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    }));
    scene.add(stars);
  }

  function buildLights(scene) {
    scene.add(new THREE.HemisphereLight("#7a9ab8", "#110d08", 0.40));

    const moonLight = new THREE.DirectionalLight("#d3dcf0", 1.2);
    moonLight.position.set(-72, 108, 18);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    moonLight.shadow.camera.left = -180;
    moonLight.shadow.camera.right = 180;
    moonLight.shadow.camera.top = 140;
    moonLight.shadow.camera.bottom = -140;
    moonLight.shadow.camera.far = 300;
    scene.add(moonLight);

    const warmSkyFill = new THREE.DirectionalLight("#d59259", 0.44);
    warmSkyFill.position.set(110, 20, -140);
    scene.add(warmSkyFill);

    const dockBounce = new THREE.PointLight("#91b1d6", 0.28, 260, 2);
    dockBounce.position.set(36, 18, -20);
    scene.add(dockBounce);
  }

  function createWater(scene) {
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(420, 320, 180, 120),
      new THREE.ShaderMaterial({
        transparent: false,
        uniforms: {
          time: { value: 0 },
          deep: { value: color("#11293d") },
          shallow: { value: color("#2a5269") },
          dusk: { value: color("#d0a06f") }
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float waveA = sin(pos.x * 0.04 + time * 0.75) * 0.8;
            float waveB = cos(pos.y * 0.06 + time * 0.52) * 0.45;
            float waveC = sin((pos.x - pos.y) * 0.03 + time * 1.15) * 0.3;
            pos.z += waveA + waveB + waveC;
            vWave = waveA + waveB + waveC;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 deep;
          uniform vec3 shallow;
          uniform vec3 dusk;
          varying vec2 vUv;
          varying float vWave;
          void main() {
            float band = smoothstep(0.08, 0.72, vUv.y);
            vec3 base = mix(shallow, deep, band);
            float ripples = sin(vUv.x * 160.0 + vWave * 6.0) * 0.02 + cos(vUv.y * 180.0 - vWave * 4.0) * 0.02;
            float gleam = smoothstep(0.38, 0.65, 1.0 - abs(vUv.x - 0.58));
            base += dusk * gleam * (0.08 + ripples);
            gl_FragColor = vec4(base, 1.0);
          }
        `
      })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(28, -0.45, -96);
    scene.add(water);
    state.waterMaterial = water.material;
  }

  function createGround(scene) {
    const cobbles = new THREE.Mesh(
      new THREE.PlaneGeometry(260, 180),
      new THREE.MeshStandardMaterial({
        map: state.textures.cobble,
        color: "#7d736d",
        roughness: 1,
        metalness: 0
      })
    );
    cobbles.rotation.x = -Math.PI / 2;
    cobbles.position.set(0, 0, 58);
    cobbles.receiveShadow = true;
    scene.add(cobbles);

    const wetStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(190, 34),
      new THREE.MeshStandardMaterial({
        map: state.textures.cobble,
        color: "#556271",
        roughness: 0.4,
        metalness: 0.03
      })
    );
    wetStrip.rotation.x = -Math.PI / 2;
    wetStrip.position.set(14, 0.03, 26);
    wetStrip.receiveShadow = true;
    scene.add(wetStrip);

    const quayTop = new THREE.Mesh(
      new THREE.BoxGeometry(208, 3.6, 22),
      new THREE.MeshStandardMaterial({
        map: state.textures.stone,
        color: "#8a847e",
        roughness: 1
      })
    );
    quayTop.position.set(12, 1.8, 22);
    quayTop.castShadow = true;
    quayTop.receiveShadow = true;
    scene.add(quayTop);

    const quayWall = new THREE.Mesh(
      new THREE.BoxGeometry(208, 15, 5),
      new THREE.MeshStandardMaterial({
        map: state.textures.stone,
        color: "#756d66",
        roughness: 1
      })
    );
    quayWall.position.set(12, 4.5, 8);
    quayWall.castShadow = true;
    quayWall.receiveShadow = true;
    scene.add(quayWall);

    createWater(scene);
  }

  function createPost(height, width) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(width || 1.2, height, width || 1.2),
      new THREE.MeshStandardMaterial({
        map: state.textures.wood,
        color: "#5a3c29",
        roughness: 0.98
      })
    );
    post.castShadow = true;
    post.receiveShadow = true;
    return post;
  }

  function createRopeCurve(a, b, sag) {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.y -= sag;
    return new THREE.QuadraticBezierCurve3(a, mid, b);
  }

  function addRope(group, a, b, sag) {
    const curve = createRopeCurve(a, b, sag);
    const points = curve.getPoints(18);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: "#8b7550", transparent: true, opacity: 0.95 })
    );
    group.add(line);
  }

  function createDock(config) {
    const group = new THREE.Group();
    const deckMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.wood,
      color: config.type === "main" ? "#725037" : "#69482f",
      roughness: 1
    });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(config.width, 1.4, config.length), deckMaterial);
    deck.position.y = 0.85;
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.add(deck);

    const braceMaterial = new THREE.MeshStandardMaterial({ map: state.textures.wood, color: "#4d3424", roughness: 1 });
    for (let i = -config.length / 2 + 3; i <= config.length / 2 - 3; i += 7.2) {
      const leftPost = createPost(6.2, 1.15);
      leftPost.position.set(-config.width / 2 + 1.15, 3.1, i);
      const rightPost = createPost(6.2, 1.15);
      rightPost.position.set(config.width / 2 - 1.15, 3.1, i);
      group.add(leftPost, rightPost);

      if (i < config.length / 2 - 9) {
        addRope(
          group,
          new THREE.Vector3(-config.width / 2 + 1.15, 5.3, i),
          new THREE.Vector3(-config.width / 2 + 1.15, 5.3, i + 7.2),
          0.75
        );
        addRope(
          group,
          new THREE.Vector3(config.width / 2 - 1.15, 5.3, i),
          new THREE.Vector3(config.width / 2 - 1.15, 5.3, i + 7.2),
          0.75
        );
      }

      const fender = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.6, 10), braceMaterial);
      fender.rotation.z = Math.PI / 2;
      fender.position.set(config.width / 2 + 0.9, 1.6, i + 0.8);
      group.add(fender);
    }

    if (config.type === "main") {
      for (let step = 0; step < 3; step += 1) {
        const stair = new THREE.Mesh(
          new THREE.BoxGeometry(3.8, 0.45, 2.4),
          deckMaterial
        );
        stair.position.set(0, 0.25 + step * 0.42, config.length / 2 - 4.8 - step * 2.2);
        group.add(stair);
      }
    }

    group.position.set(config.x, 0, config.z - config.length / 2);
    return group;
  }

  function createGabledRoof(width, depth, height, roofMaterial) {
    const hw = width / 2;
    const hd = depth / 2;
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -hw, 0, -hd,   hw, 0, -hd,   0, height, -hd,
      -hw, 0, hd,    hw, 0, hd,    0, height, hd,
      -hw, 0, -hd,   0, height, -hd,   0, height, hd,
      -hw, 0, -hd,   0, height, hd,    -hw, 0, hd,
      hw, 0, -hd,    0, height, hd,    0, height, -hd,
      hw, 0, -hd,    hw, 0, hd,        0, height, hd,
      -hw, 0, -hd,   -hw, 0, hd,       hw, 0, hd,
      -hw, 0, -hd,   hw, 0, hd,        hw, 0, -hd
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, roofMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  function addSceneLantern(scene, x, y, z, intensity, distance) {
    const fixture = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 10, 10),
      new THREE.MeshStandardMaterial({
        color: "#f5d3a0",
        emissive: "#ebae55",
        emissiveIntensity: 1.4
      })
    );
    fixture.position.set(x, y, z);
    scene.add(fixture);

    const glowMat = new THREE.MeshBasicMaterial({
      color: "#f3920a",
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    [0, Math.PI / 2].forEach((ry) => {
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), glowMat);
      glow.position.set(x, y, z);
      glow.rotation.y = ry;
      scene.add(glow);
    });

    const light = new THREE.PointLight("#f3b867", intensity || 0.8, distance || 30, 2);
    light.position.set(x, y, z);
    scene.add(light);
  }

  function createWindow(x, y, z, width, height, material) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    pane.position.set(x, y, z);
    return pane;
  }

  function createBuilding(spec) {
    const group = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.plaster,
      color: spec.plaster,
      roughness: 0.95
    });
    const timberMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.wood,
      color: spec.timber,
      roughness: 0.98
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.roof,
      color: spec.roof,
      roughness: 1
    });
    const recessMaterial = new THREE.MeshStandardMaterial({ color: "#150f0b", roughness: 1 });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: "#5b4333", roughness: 0.9 });

    // AO contact shadow at base
    const aoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(spec.width + 4, spec.depth + 4),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.28, depthWrite: false })
    );
    aoPlane.rotation.x = -Math.PI / 2;
    aoPlane.position.set(0, 0.02, 0);
    group.add(aoPlane);

    // Split into lower (flush) and jettied upper section
    const lowerH = spec.height * 0.52;
    const upperH = spec.height - lowerH;
    const jetty = spec.kind === "shed" ? 0 : spec.kind === "warehouse" ? 0.9 : 1.6;
    const upperDepth = spec.depth + jetty;
    const lowerFrontZ = spec.depth / 2;
    const upperFrontZ = spec.depth / 2 + jetty;

    const lower = new THREE.Mesh(new THREE.BoxGeometry(spec.width, lowerH, spec.depth), wallMaterial);
    lower.position.y = lowerH / 2;
    lower.castShadow = true;
    lower.receiveShadow = true;
    group.add(lower);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(spec.width, upperH, upperDepth), wallMaterial);
    upper.position.set(0, lowerH + upperH / 2, jetty / 2);
    upper.castShadow = true;
    upper.receiveShadow = true;
    group.add(upper);

    // Jetty floor slab — visible overhang underside
    if (jetty > 0) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width + 0.6, 0.52, jetty + 0.4),
        timberMaterial
      );
      slab.position.set(0, lowerH, lowerFrontZ + jetty / 2);
      slab.castShadow = true;
      group.add(slab);
    }

    // Gabled roof with ridge beam
    const roof = createGabledRoof(spec.width + 1.8, upperDepth + 1.4, spec.roofHeight, roofMaterial);
    roof.position.set(0, spec.height, jetty / 2);
    group.add(roof);
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(spec.width + 2.2, 0.38, 0.38), timberMaterial);
    ridge.position.set(0, spec.height + spec.roofHeight - 0.1, jetty / 2);
    ridge.castShadow = true;
    group.add(ridge);

    // Chimney stacks piercing through the roof
    const chimneyOffsets = spec.kind === "shed"
      ? [{ x: spec.width * 0.18, z: 0 }]
      : [{ x: spec.width * 0.22, z: -spec.depth * 0.08 }, { x: -spec.width * 0.26, z: spec.depth * 0.06 }];
    chimneyOffsets.forEach((cp) => {
      const stackH = spec.roofHeight + 3.2;
      const stack = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, stackH, 1.35),
        new THREE.MeshStandardMaterial({ map: state.textures.stone, color: spec.plaster, roughness: 1 })
      );
      stack.position.set(cp.x, spec.height + stackH / 2, cp.z + jetty / 2);
      stack.castShadow = true;
      group.add(stack);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.3, 2.1), timberMaterial);
      cap.position.set(cp.x, spec.height + stackH + 0.15, cp.z + jetty / 2);
      group.add(cap);
    });

    // Corner posts — one set per floor section
    for (let side = -1; side <= 1; side += 2) {
      const postLow = new THREE.Mesh(new THREE.BoxGeometry(0.62, lowerH + 0.3, 0.52), timberMaterial);
      postLow.position.set(side * (spec.width / 2 - 0.58), lowerH / 2, lowerFrontZ + 0.12);
      group.add(postLow);
      const postHi = new THREE.Mesh(new THREE.BoxGeometry(0.62, upperH + 0.3, 0.52), timberMaterial);
      postHi.position.set(side * (spec.width / 2 - 0.58), lowerH + upperH / 2, upperFrontZ + 0.12);
      group.add(postHi);
    }

    // Horizontal belts at jetty line and eave
    const beltJetty = new THREE.Mesh(new THREE.BoxGeometry(spec.width + 0.5, 0.62, 0.5), timberMaterial);
    beltJetty.position.set(0, lowerH, lowerFrontZ + 0.18);
    group.add(beltJetty);
    const beltEave = new THREE.Mesh(new THREE.BoxGeometry(spec.width + 0.5, 0.55, 0.48), timberMaterial);
    beltEave.position.set(0, spec.height - 1.6, upperFrontZ + 0.14);
    group.add(beltEave);

    // Diagonal X cross-brace on lower facade
    const diagW = spec.width * 0.72;
    const diagH = lowerH * 0.76;
    const diagLen = Math.hypot(diagW, diagH);
    const diagAngle = Math.atan2(diagW, diagH);
    [-1, 1].forEach((dir) => {
      const diag = new THREE.Mesh(new THREE.BoxGeometry(0.4, diagLen, 0.4), timberMaterial);
      diag.position.set(0, lowerH * 0.46, lowerFrontZ + 0.12);
      diag.rotation.z = dir * diagAngle;
      group.add(diag);
    });

    // Recessed windows with frame surround, dark inset, glowing pane, sill
    const windowGlowMaterial = new THREE.MeshStandardMaterial({
      color: "#f4c77a",
      emissive: "#dc9840",
      emissiveIntensity: 0.72,
      roughness: 0.5
    });
    const cols = Math.max(2, Math.round(spec.width / 5.5));
    [
      { startY: lowerH * 0.44, rows: 1, fz: lowerFrontZ },
      { startY: lowerH + upperH * 0.32, rows: Math.max(1, Math.round((upperH - 2) / 3.5)), fz: upperFrontZ }
    ].forEach(({ startY, rows, fz }) => {
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const px = -spec.width / 2 + 2.6 + col * ((spec.width - 5.2) / Math.max(1, cols - 1));
          const py = startY + row * 3.5;
          const pz = fz + 0.06;

          const frame = new THREE.Mesh(new THREE.BoxGeometry(1.72, 2.08, 0.3), frameMaterial);
          frame.position.set(px, py, pz);
          group.add(frame);

          const inset = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.62), recessMaterial);
          inset.position.set(px, py, pz + 0.07);
          group.add(inset);

          const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 1.54), windowGlowMaterial);
          pane.position.set(px, py, pz + 0.09);
          group.add(pane);

          const sill = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.2, 0.48), frameMaterial);
          sill.position.set(px, py - 1.1, pz + 0.06);
          group.add(sill);
        }
      }
    });

    if (spec.kind === "inn") {
      const porchFloor = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width * 0.62, 0.48, 5.2),
        timberMaterial
      );
      porchFloor.position.set(0, 1.5, upperFrontZ + 2.4);
      group.add(porchFloor);

      const porchRoof = createGabledRoof(spec.width * 0.54, 5.8, 2.6, roofMaterial);
      porchRoof.position.set(0, 6.2, upperFrontZ + 2.4);
      group.add(porchRoof);

      [-1, 1].forEach((sx) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.66, 5.0, 0.66), timberMaterial);
        pillar.position.set(sx * spec.width * 0.19, 3.2, upperFrontZ + 2.2);
        group.add(pillar);
      });

      const balcony = new THREE.Mesh(
        new THREE.BoxGeometry(spec.width * 0.68, 0.55, 4.6),
        timberMaterial
      );
      balcony.position.set(0, lowerH + 0.42, upperFrontZ + 2.4);
      group.add(balcony);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(spec.width * 0.68, 0.18, 0.2), timberMaterial);
      rail.position.set(0, lowerH + 1.55, upperFrontZ + 4.4);
      group.add(rail);

      for (let i = -3; i <= 3; i += 1) {
        const baluster = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.3, 0.28), timberMaterial);
        baluster.position.set(i * 2.0, lowerH + 0.92, upperFrontZ + 4.4);
        group.add(baluster);
      }
    }

    group.position.set(spec.position.x, spec.position.y, spec.position.z);
    return group;
  }

  function addFacadeCard(scene, imagePath, options) {
    loadTexture(imagePath, (texture) => {
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: false,
        roughness: 0.9
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(options.width, options.height), material);
      plane.position.set(options.x, options.y, options.z);
      plane.rotation.y = options.rotationY || 0;
      plane.castShadow = true;
      scene.add(plane);
    });
  }

  function createInnHero(scene, config) {
    addFacadeCard(scene, config.facadeImage, {
      width: 42,
      height: 30,
      x: -38,
      y: 15.5,
      z: 40.9,
      rotationY: 0
    });

    const sideMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.plaster,
      color: "#977d62",
      roughness: 0.96
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.roof,
      color: "#263241",
      roughness: 1
    });

    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(15, 18, 18), sideMaterial);
    leftWing.position.set(-54, 9, 32);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    scene.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(15, 18, 16), sideMaterial);
    rightWing.position.set(-22, 9, 32);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    scene.add(rightWing);

    const body = new THREE.Mesh(new THREE.BoxGeometry(26, 18, 12), sideMaterial);
    body.position.set(-38, 9, 31);
    body.castShadow = true;
    body.receiveShadow = true;
    scene.add(body);

    const leftRoof = createGabledRoof(17, 19, 8, roofMaterial);
    leftRoof.position.set(-54, 18, 32);
    scene.add(leftRoof);
    const rightRoof = createGabledRoof(17, 17, 8, roofMaterial);
    rightRoof.position.set(-22, 18, 32);
    scene.add(rightRoof);
    const centerRoof = createGabledRoof(28, 13, 6, roofMaterial);
    centerRoof.position.set(-38, 18, 31);
    scene.add(centerRoof);

    // AO contact shadow under the entire inn complex
    const innAO = new THREE.Mesh(
      new THREE.PlaneGeometry(56, 32),
      new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.32, depthWrite: false })
    );
    innAO.rotation.x = -Math.PI / 2;
    innAO.position.set(-38, 0.02, 32);
    scene.add(innAO);

    // Chimney stacks on the inn roofline
    const innChimneyMat = new THREE.MeshStandardMaterial({ map: state.textures.stone, color: "#938679", roughness: 1 });
    const innCapMat = new THREE.MeshStandardMaterial({ map: state.textures.wood, color: "#4a3727", roughness: 1 });
    [
      { x: -54, z: 26 },
      { x: -22, z: 27 },
      { x: -40, z: 29 },
      { x: -34, z: 28 }
    ].forEach((cp) => {
      const stack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 13, 1.4), innChimneyMat);
      stack.position.set(cp.x, 24.5, cp.z);
      stack.castShadow = true;
      scene.add(stack);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.32, 2.2), innCapMat);
      cap.position.set(cp.x, 31.15, cp.z);
      scene.add(cap);
    });

    const terrace = new THREE.Mesh(
      new THREE.BoxGeometry(28, 1.2, 10),
      new THREE.MeshStandardMaterial({
        map: state.textures.wood,
        color: "#69452f",
        roughness: 1
      })
    );
    terrace.position.set(-38, 0.6, 53);
    terrace.receiveShadow = true;
    scene.add(terrace);

    for (let i = -3; i <= 3; i += 1) {
      const bollard = createPost(2.1, 0.6);
      bollard.position.set(-38 + i * 4, 1.05, 57);
      scene.add(bollard);
      if (i < 3) {
        addRope(
          scene,
          new THREE.Vector3(-38 + i * 4, 2.2, 57),
          new THREE.Vector3(-38 + (i + 1) * 4, 2.2, 57),
          0.35
        );
      }
    }

    addSceneLantern(scene, -45, 6.4, 48.5, 0.75, 24);
    addSceneLantern(scene, -31, 6.4, 48.5, 0.75, 24);
    addSceneLantern(scene, -39, 10.6, 43.4, 0.55, 18);
    addFacadeCard(scene, config.signImage, {
      width: 7.8,
      height: 10.8,
      x: -56.5,
      y: 10.2,
      z: 48.7,
      rotationY: Math.PI / 2
    });
  }

  function createProps(scene, config) {
    const crateMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.wood,
      color: "#7c5637",
      roughness: 1
    });
    config.props.crates.forEach((crate, index) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(crate.w, crate.h, crate.d), crateMaterial);
      mesh.position.set(crate.x, crate.h / 2, crate.z);
      mesh.rotation.y = (index % 3) * 0.18;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    const barrelMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.wood,
      color: "#5b402b",
      roughness: 1
    });
    config.props.barrels.forEach((barrel, index) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(barrel.r, barrel.r * 1.06, barrel.h, 14), barrelMaterial);
      mesh.position.set(barrel.x, barrel.h / 2, barrel.z);
      mesh.rotation.y = index * 0.2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    });

    const lampPostMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.wood,
      color: "#413021",
      roughness: 1
    });
    config.props.lampPosts.forEach((post) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, post.h, 8), lampPostMaterial);
      pole.position.set(post.x, post.h / 2, post.z);
      pole.castShadow = true;
      scene.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 0.2), lampPostMaterial);
      arm.position.set(post.x + 1.1, post.h - 0.7, post.z);
      arm.castShadow = true;
      scene.add(arm);

      addSceneLantern(scene, post.x + 1.95, post.h - 1.22, post.z, 0.95, 28);
    });

    config.props.marketAwnings.forEach((awning, index) => {
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(awning.w, 0.28, awning.d),
        new THREE.MeshStandardMaterial({ color: awning.color, roughness: 0.92 })
      );
      canopy.position.set(awning.x, 5.45, awning.z);
      canopy.rotation.z = index % 2 ? -0.04 : 0.05;
      scene.add(canopy);

      [-1, 1].forEach((sx) => {
        [-1, 1].forEach((sz) => {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 6), lampPostMaterial);
          pole.position.set(awning.x + (sx * awning.w) / 2.35, 2.6, awning.z + (sz * awning.d) / 2.35);
          scene.add(pole);
        });
      });
    });

    const craneBase = new THREE.Mesh(
      new THREE.BoxGeometry(10, 2.8, 10),
      new THREE.MeshStandardMaterial({
        map: state.textures.wood,
        color: "#55402d",
        roughness: 1
      })
    );
    craneBase.position.set(34, 1.5, 12);
    scene.add(craneBase);

    const craneA = createPost(18, 1);
    craneA.position.set(31, 10, 10);
    craneA.rotation.z = -0.32;
    scene.add(craneA);
    const craneB = createPost(14, 0.9);
    craneB.position.set(37, 8.6, 10);
    craneB.rotation.z = 0.62;
    scene.add(craneB);
    addRope(scene, new THREE.Vector3(35, 14.5, 10), new THREE.Vector3(39.5, 4.1, 10), 0.45);
  }

  function createHullGeometry(scale) {
    const shape = new THREE.Shape();
    shape.moveTo(-6.8 * scale, 0);
    shape.quadraticCurveTo(-3.2 * scale, -3.8 * scale, 3.8 * scale, -3.1 * scale);
    shape.quadraticCurveTo(8.4 * scale, -1.2 * scale, 8.9 * scale, 0.5 * scale);
    shape.lineTo(8.6 * scale, 4.4 * scale);
    shape.quadraticCurveTo(3.0 * scale, 6.8 * scale, -5.8 * scale, 5.1 * scale);
    shape.quadraticCurveTo(-8.0 * scale, 3.8 * scale, -6.8 * scale, 0);
    const extrude = new THREE.ExtrudeGeometry(shape, { depth: 5 * scale, bevelEnabled: false });
    extrude.center();
    return extrude;
  }

  function createRigLine(group, from, to, colorHex) {
    const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: colorHex || "#483a31",
      transparent: true,
      opacity: 0.8
    }));
    group.add(line);
  }

  function createShip(shipSpec) {
    const group = new THREE.Group();
    const hull = new THREE.Mesh(
      createHullGeometry(shipSpec.scale),
      new THREE.MeshStandardMaterial({
        color: shipSpec.hull,
        roughness: 0.95
      })
    );
    hull.rotation.x = Math.PI / 2;
    hull.castShadow = true;
    hull.receiveShadow = true;
    group.add(hull);

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(11.6 * shipSpec.scale, 0.7, 4.1 * shipSpec.scale),
      new THREE.MeshStandardMaterial({
        map: state.textures.wood,
        color: "#725037",
        roughness: 1
      })
    );
    deck.position.y = 3.8 * shipSpec.scale;
    group.add(deck);

    const stern = new THREE.Mesh(
      new THREE.BoxGeometry(3.9 * shipSpec.scale, 3.1 * shipSpec.scale, 3 * shipSpec.scale),
      new THREE.MeshStandardMaterial({
        color: "#5a402e",
        roughness: 0.95
      })
    );
    stern.position.set(-1.6 * shipSpec.scale, 5.5 * shipSpec.scale, 0);
    group.add(stern);

    const mastSpecs = [
      { x: 2.1, h: 14.5, yard: 6.4, sailW: 5.4, sailH: 7.2 },
      { x: -3.6, h: 10.6, yard: 5.1, sailW: 4.2, sailH: 5.8 }
    ];

    mastSpecs.forEach((mastSpec) => {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 * shipSpec.scale, 0.26 * shipSpec.scale, mastSpec.h * shipSpec.scale, 8),
        new THREE.MeshStandardMaterial({ color: "#4a3426", roughness: 1 })
      );
      mast.position.set(mastSpec.x * shipSpec.scale, (mastSpec.h / 2 + 3.6) * shipSpec.scale, 0);
      mast.castShadow = true;
      group.add(mast);

      const yard = new THREE.Mesh(
        new THREE.BoxGeometry(mastSpec.yard * shipSpec.scale, 0.12 * shipSpec.scale, 0.12 * shipSpec.scale),
        new THREE.MeshStandardMaterial({ color: "#4b3527", roughness: 1 })
      );
      yard.position.set(mast.position.x, mast.position.y + 0.85 * shipSpec.scale, 0);
      group.add(yard);

      const sail = new THREE.Mesh(
        new THREE.PlaneGeometry(mastSpec.sailW * shipSpec.scale, mastSpec.sailH * shipSpec.scale),
        new THREE.MeshStandardMaterial({
          color: shipSpec.sail,
          roughness: 1,
          side: THREE.DoubleSide
        })
      );
      sail.position.set(mast.position.x + 0.45 * shipSpec.scale, mast.position.y, 0);
      sail.rotation.y = Math.PI / 2;
      sail.rotation.z = mastSpec.x > 0 ? 0.06 : -0.05;
      group.add(sail);

      createRigLine(group, new THREE.Vector3(mast.position.x, mast.position.y + 6 * shipSpec.scale, 0), new THREE.Vector3(6.1 * shipSpec.scale, 3.5 * shipSpec.scale, 0));
      createRigLine(group, new THREE.Vector3(mast.position.x, mast.position.y + 6 * shipSpec.scale, 0), new THREE.Vector3(-6.3 * shipSpec.scale, 3.5 * shipSpec.scale, 0));
    });

    const bowsprit = new THREE.Mesh(
      new THREE.BoxGeometry(4.8 * shipSpec.scale, 0.16 * shipSpec.scale, 0.16 * shipSpec.scale),
      new THREE.MeshStandardMaterial({ color: "#4a3426", roughness: 1 })
    );
    bowsprit.position.set(8.1 * shipSpec.scale, 5.2 * shipSpec.scale, 0);
    bowsprit.rotation.z = -0.2;
    group.add(bowsprit);

    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 8, 8),
      new THREE.MeshStandardMaterial({
        color: "#f9dba2",
        emissive: shipSpec.lantern || "#e0a454",
        emissiveIntensity: 1
      })
    );
    lantern.position.set(4.2 * shipSpec.scale, 5.15 * shipSpec.scale, 1.6 * shipSpec.scale);
    group.add(lantern);

    group.position.set(shipSpec.position.x, shipSpec.position.y, shipSpec.position.z);
    group.rotation.y = shipSpec.heading;
    state.bobbers.push({
      object: group,
      baseY: shipSpec.position.y,
      seed: Math.random() * Math.PI * 2
    });
    return group;
  }

  function createCurvedBackdrop(scene, config) {
    loadTexture(config.backdropImage, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const width = 390;
      const height = 150;
      const segments = 42;
      const geometry = new THREE.PlaneGeometry(width, height, segments, 1);
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 1) {
        const x = pos.getX(i);
        const bend = -Math.abs(x / (width / 2)) * 24;
        pos.setZ(i, bend);
      }
      pos.needsUpdate = true;
      geometry.computeVertexNormals();

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        fog: false
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(22, 62, -212);
      scene.add(plane);
    });
  }

  function createAtmosphere(scene) {
    const fogMaterial = new THREE.MeshBasicMaterial({
      map: state.textures.fog,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      color: "#b3bfd0"
    });

    const placements = [
      { x: -14, y: 10, z: 18, w: 96, h: 34, o: 0.18 },
      { x: 36, y: 12, z: -4, w: 120, h: 40, o: 0.22 },
      { x: 66, y: 18, z: -54, w: 150, h: 46, o: 0.18 }
    ];
    placements.forEach((entry, index) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(entry.w, entry.h), fogMaterial.clone());
      mesh.material.opacity = entry.o;
      mesh.position.set(entry.x, entry.y, entry.z);
      mesh.rotation.y = -0.12 - index * 0.08;
      scene.add(mesh);
      state.fogPlanes.push({ mesh, seed: index * 0.9 });
    });
  }

  function createWallsAndLighthouse(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({
      map: state.textures.stone,
      color: "#7e756a",
      roughness: 1
    });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(196, 26, 9), wallMaterial);
    wall.position.set(-4, 13, 86);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    [-76, -20, 48].forEach((x) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 6.6, 30, 10), wallMaterial);
      tower.position.set(x, 15, 86);
      tower.castShadow = true;
      tower.receiveShadow = true;
      scene.add(tower);
    });

    const lighthouseBody = new THREE.Mesh(
      new THREE.CylinderGeometry(5.4, 7.8, 42, 16),
      new THREE.MeshStandardMaterial({
        color: "#b9b4aa",
        roughness: 0.92
      })
    );
    lighthouseBody.position.set(106, 21, -110);
    lighthouseBody.castShadow = true;
    scene.add(lighthouseBody);

    const lanternRoom = new THREE.Mesh(
      new THREE.CylinderGeometry(4.3, 5.0, 7, 12),
      new THREE.MeshStandardMaterial({
        color: "#605244",
        roughness: 0.88
      })
    );
    lanternRoom.position.set(106, 44, -110);
    scene.add(lanternRoom);
    addSceneLantern(scene, 106, 46.6, -110, 1.9, 60);
  }

  function createHotspot(scene, hotspot) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.12, 10, 48),
      new THREE.MeshBasicMaterial({
        color: "#d4af37",
        transparent: true,
        opacity: 0.4
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(hotspot.position.x, 0.36, hotspot.position.z);
    scene.add(ring);

    const target = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 12, 12),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    target.position.set(hotspot.position.x, hotspot.position.y, hotspot.position.z);
    target.userData.hotspot = hotspot;
    scene.add(target);
    state.hotspotTargets.push(target);
  }

  function buildScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#0e1620", 0.0076);
    state.scene = scene;

    buildSky(scene);
    buildLights(scene);

    // Warm fill lights that bathe the waterfront building faces
    [
      { x: -38, y: 5, z: 55, color: "#f27a1a", intensity: 0.38, distance: 60 },
      { x: 12,  y: 4, z: 50, color: "#e87428", intensity: 0.28, distance: 50 },
      { x: 46,  y: 4, z: 65, color: "#f09030", intensity: 0.22, distance: 42 }
    ].forEach(({ x, y, z, color: c, intensity, distance }) => {
      const fill = new THREE.PointLight(c, intensity, distance, 2);
      fill.position.set(x, y, z);
      scene.add(fill);
    });

    createGround(scene);
    createWallsAndLighthouse(scene);
    createCurvedBackdrop(scene, state.config);
    createAtmosphere(scene);
    createInnHero(scene, state.config);

    state.config.docks.forEach((dock) => scene.add(createDock(dock)));
    state.config.buildings.forEach((building) => {
      if (building.kind !== "inn") {
        const mesh = createBuilding(building);
        scene.add(mesh);
      }
      if (Array.isArray(building.lanterns)) {
        building.lanterns.forEach((lantern) => addSceneLantern(scene, lantern.x, lantern.y, lantern.z, 0.72, 26));
      }
    });
    state.config.ships.forEach((ship) => scene.add(createShip(ship)));
    createProps(scene, state.config);
    state.config.hotspots.forEach((hotspot) => createHotspot(scene, hotspot));
  }

  function setCameraRotation() {
    state.camera.rotation.order = "YXZ";
    state.camera.rotation.y = state.yaw;
    state.camera.rotation.x = state.pitch;
  }

  function resetCamera() {
    const start = state.playerStart;
    state.camera.position.set(start.x, start.y, start.z);
    if (start.lookAt) {
      const target = new THREE.Vector3(start.lookAt.x, start.lookAt.y, start.lookAt.z);
      const direction = new THREE.Vector3().subVectors(target, state.camera.position).normalize();
      state.yaw = Math.atan2(-direction.x, -direction.z);
      state.pitch = Math.asin(clamp(direction.y, -0.99, 0.99));
    } else {
      state.yaw = start.yaw || 0;
      state.pitch = start.pitch || 0;
    }
    setCameraRotation();
  }

  function updateMovement(delta) {
    const speed = state.keys.has("ShiftLeft") || state.keys.has("ShiftRight") ? 28 : 14;
    const move = new THREE.Vector3();
    if (state.keys.has("KeyW")) move.z -= 1;
    if (state.keys.has("KeyS")) move.z += 1;
    if (state.keys.has("KeyA")) move.x -= 1;
    if (state.keys.has("KeyD")) move.x += 1;

    if (move.lengthSq() > 0) {
      move.normalize();
      const forward = new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw)).multiplyScalar(-1);
      const right = new THREE.Vector3(forward.z, 0, -forward.x);
      state.velocity.copy(forward.multiplyScalar(move.z).add(right.multiplyScalar(move.x)).multiplyScalar(speed * delta));
      state.camera.position.add(state.velocity);
    }

    state.camera.position.x = clamp(state.camera.position.x, state.config.bounds.minX, state.config.bounds.maxX);
    state.camera.position.z = clamp(state.camera.position.z, state.config.bounds.minZ, state.config.bounds.maxZ);
    state.camera.position.y = lerp(state.camera.position.y, 7.45 + Math.sin(state.elapsed * 3.2) * 0.03, Math.min(1, delta * 7));
  }

  function onPointerDown(event) {
    state.pointer.active = true;
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
  }

  function onPointerMove(event) {
    if (!state.pointer.active) {
      updateHotspotHover(event);
      return;
    }
    const dx = event.clientX - state.pointer.x;
    const dy = event.clientY - state.pointer.y;
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    state.yaw -= dx * 0.0032;
    state.pitch = clamp(state.pitch - dy * 0.0022, -0.44, 0.22);
    setCameraRotation();
  }

  function onPointerUp() {
    state.pointer.active = false;
  }

  function updateHotspotHover(event) {
    const rect = state.renderer.domElement.getBoundingClientRect();
    state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.mouse, state.camera);
    const hits = state.raycaster.intersectObjects(state.hotspotTargets, false);
    if (hits.length > 0) {
      renderTooltip(event.clientX, event.clientY, hits[0].object.userData.hotspot);
    } else {
      hideTooltip();
    }
  }

  function renderTooltip(x, y, hotspot) {
    if (!state.tooltip) return;
    state.tooltip.classList.add("visible");
    state.tooltip.style.left = `${x + 18}px`;
    state.tooltip.style.top = `${y + 18}px`;
    document.getElementById("hotspot-name").textContent = hotspot.name;
    document.getElementById("hotspot-type").textContent = hotspot.type;
    document.getElementById("hotspot-desc").textContent = hotspot.description;
  }

  function hideTooltip() {
    if (!state.tooltip) return;
    state.tooltip.classList.remove("visible");
  }

  function updateOverlayInfo() {
    document.getElementById("scene-city-name").textContent = state.config.cityName;
    document.getElementById("scene-name").textContent = state.config.sceneName;
    document.getElementById("scene-subtitle").textContent = state.config.sceneSubtitle;
    document.getElementById("scene-tagline").textContent = state.config.tagline;

    const loreList = document.getElementById("scene-lore");
    loreList.innerHTML = "";
    state.config.lore.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item;
      loreList.appendChild(p);
    });

    const controlsList = document.getElementById("scene-controls");
    controlsList.innerHTML = "";
    state.config.controls.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      controlsList.appendChild(li);
    });

    const minimap = document.getElementById("scene-minimap");
    const focus = document.getElementById("scene-focus");
    minimap.onload = () => {
      focus.style.left = `${state.config.mapFocus.x}%`;
      focus.style.top = `${state.config.mapFocus.y}%`;
      focus.style.opacity = "1";
    };
    minimap.src = state.config.cityMapImage;
  }

  function bootVideoScene() {
    document.body.classList.add("video-scene");
    updateOverlayInfo();
    bindVideoEvents();

    const video = document.getElementById("scene-video");
    const loading = document.getElementById("loading-screen");
    video.src = state.config.sceneVideo;
    video.addEventListener("canplay", () => loading.classList.add("hidden"), { once: true });
    video.addEventListener("error", () => {
      loading.querySelector("h1").textContent = "Scene Video Missing";
      loading.querySelector("p").textContent = `Could not load ${state.config.sceneVideo}. Check the city scene folder and filename.`;
    }, { once: true });

    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => loading.classList.add("hidden"));
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(0.033, state.clock.getDelta());
    state.elapsed += delta;

    if (state.waterMaterial) {
      state.waterMaterial.uniforms.time.value += delta;
    }

    state.bobbers.forEach((entry, index) => {
      const t = state.elapsed + entry.seed + index * 0.3;
      entry.object.position.y = entry.baseY + Math.sin(t * 1.15) * 0.24;
      entry.object.rotation.z = Math.sin(t * 0.7) * 0.02;
    });

    state.fogPlanes.forEach((entry, index) => {
      entry.mesh.position.x += Math.sin(state.elapsed * 0.12 + entry.seed) * 0.012;
      entry.mesh.material.opacity = 0.14 + Math.sin(state.elapsed * 0.6 + index) * 0.04 + index * 0.02;
    });

    updateMovement(delta);
    state.renderer.render(state.scene, state.camera);
  }

  function onResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("scene-canvas"),
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    state.renderer = renderer;
  }

  function parseConfig() {
    const params = new URLSearchParams(window.location.search);
    const cityId = (params.get("city") || "basctdelm").toLowerCase();
    return window.CITY_SCENE_DATA[cityId] || window.CITY_SCENE_DATA.basctdelm;
  }

  function bindEvents() {
    const canvas = state.renderer.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyR") {
        resetCamera();
        return;
      }
      state.keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => state.keys.delete(event.code));

    document.getElementById("reset-camera").addEventListener("click", resetCamera);
    document.getElementById("toggle-lore").addEventListener("click", () => {
      document.getElementById("lore-panel").classList.toggle("collapsed");
    });
    document.getElementById("toggle-minimap").addEventListener("click", () => {
      document.getElementById("minimap-panel").classList.toggle("collapsed");
    });
  }

  function bindVideoEvents() {
    document.getElementById("reset-camera").textContent = "Restart";
    document.getElementById("reset-camera").addEventListener("click", () => {
      const video = document.getElementById("scene-video");
      video.currentTime = 0;
      video.play();
    });
    document.getElementById("toggle-lore").addEventListener("click", () => {
      document.getElementById("lore-panel").classList.toggle("collapsed");
    });
    document.getElementById("toggle-minimap").addEventListener("click", () => {
      document.getElementById("minimap-panel").classList.toggle("collapsed");
    });
  }

  function boot() {
    state.config = parseConfig();
    state.playerStart = state.config.playerStart;
    state.tooltip = document.getElementById("hotspot-tooltip");
    if (state.config.sceneVideo) {
      bootVideoScene();
      return;
    }
    createRenderer();
    state.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1200);
    state.clock = new THREE.Clock();
    createTextures();
    buildScene();
    resetCamera();
    updateOverlayInfo();
    bindEvents();
    document.getElementById("loading-screen").classList.add("hidden");
    animate();
  }

  return { boot };
})();
