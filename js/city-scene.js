const CitySceneApp = (function () {
  const state = {
    config: null,
    engine: null,
    scene: null,
    camera: null,
    elapsed: 0,
    bobbers: [],
    fogMeshes: [],
    hotspotMeshes: [],
    textures: {},
    waterMat: null,
    glowLayer: null,
    tooltip: null
  };

  // --- Utilities ---
  function v3(x, y, z) { return new BABYLON.Vector3(x, y, z); }

  function c3(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new BABYLON.Color3(r, g, b);
  }

  // --- Canvas textures ---
  function makeDynTex(name, size, drawFn, uScale, vScale) {
    const dt = new BABYLON.DynamicTexture(name, { width: size, height: size }, state.scene, true);
    const ctx = dt.getContext();
    drawFn(ctx, size);
    dt.update();
    dt.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    dt.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
    if (uScale) dt.uScale = uScale;
    if (vScale) dt.vScale = vScale;
    return dt;
  }

  function createTextures() {
    state.textures.wood = makeDynTex("wood", 768, (ctx, size) => {
      const g = ctx.createLinearGradient(0, 0, size, 0);
      g.addColorStop(0, "#5b3d2c");
      g.addColorStop(0.4, "#744d33");
      g.addColorStop(1, "#4d3324");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      for (let p = 0; p < 12; p++) {
        ctx.fillStyle = p % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
        ctx.fillRect(0, p * (size / 12), size, size / 12);
      }
      for (let i = 0; i < 2400; i++) {
        const x = Math.random() * size, y = Math.random() * size;
        ctx.strokeStyle = `rgba(38,24,15,${0.05 + Math.random() * 0.12})`;
        ctx.lineWidth = 0.7 + Math.random() * 2.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(
          x + 30 + Math.random() * 34, y + (Math.random() - 0.5) * 18,
          x + 56 + Math.random() * 34, y + (Math.random() - 0.5) * 20,
          x + 90 + Math.random() * 38, y + (Math.random() - 0.5) * 12
        );
        ctx.stroke();
      }
    }, 3.4, 3.4);

    state.textures.stone = makeDynTex("stone", 768, (ctx, size) => {
      ctx.fillStyle = "#80786f";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 54) {
        for (let x = 0; x < size; x += 88) {
          const bx = x + ((y / 54) % 2 === 0 ? 0 : 32);
          const r = 118 + Math.floor(Math.random() * 25);
          ctx.fillStyle = `rgba(${r},${r - 4},${r - 11},0.92)`;
          ctx.fillRect(bx, y, 74 + Math.random() * 8, 40 + Math.random() * 8);
          ctx.strokeStyle = "rgba(28,27,25,0.3)";
          ctx.strokeRect(bx, y, 74, 40);
        }
      }
    }, 2.4, 2.4);

    state.textures.cobble = makeDynTex("cobble", 768, (ctx, size) => {
      ctx.fillStyle = "#6f6966";
      ctx.fillRect(0, 0, size, size);
      for (let y = 26; y < size; y += 54) {
        for (let x = 18; x < size; x += 40) {
          const wx = (Math.random() - 0.5) * 8, wy = (Math.random() - 0.5) * 6;
          const w = 28 + Math.random() * 9, h = 14 + Math.random() * 6;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x + wx, y + wy, w, h, 7);
          else ctx.rect(x + wx, y + wy, w, h);
          const b = 116 + Math.floor(Math.random() * 30);
          ctx.fillStyle = `rgba(${b},${b - 5},${b - 8},0.94)`;
          ctx.fill();
          ctx.strokeStyle = "rgba(40,40,42,0.22)";
          ctx.stroke();
        }
      }
    }, 5.5, 7.5);

    state.textures.plaster = makeDynTex("plaster", 768, (ctx, size) => {
      ctx.fillStyle = "#b49b7b";
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 9000; i++) {
        const s = 158 + Math.floor(Math.random() * 55);
        ctx.fillStyle = `rgba(${s},${s - 8},${s - 18},0.05)`;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 3, 2 + Math.random() * 3);
      }
      for (let i = 0; i < 140; i++) {
        ctx.strokeStyle = `rgba(72,54,40,${0.03 + Math.random() * 0.05})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        const x = Math.random() * size, y = Math.random() * size;
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 70, y + (Math.random() - 0.5) * 90);
        ctx.stroke();
      }
    }, 2.8, 2.8);

    state.textures.roof = makeDynTex("roof", 768, (ctx, size) => {
      ctx.fillStyle = "#334252";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 22) {
        for (let x = ((y / 22) % 2) * 16; x < size; x += 36) {
          const t = 48 + Math.floor(Math.random() * 38);
          ctx.fillStyle = `rgba(${t},${t + 7},${t + 16},0.97)`;
          ctx.fillRect(x, y, 28, 18);
          ctx.strokeStyle = "rgba(8,10,14,0.28)";
          ctx.strokeRect(x, y, 28, 18);
        }
      }
    }, 2.3, 3.2);
  }

  // --- Material helpers ---
  function makePBR(name, texKey, roughness, hexColor) {
    const mat = new BABYLON.PBRMetallicRoughnessMaterial(name + "_" + Math.random().toString(36).slice(2), state.scene);
    if (texKey && state.textures[texKey]) mat.baseTexture = state.textures[texKey];
    if (hexColor) mat.baseColor = c3(hexColor);
    mat.metallic = 0;
    mat.roughness = roughness !== undefined ? roughness : 0.95;
    return mat;
  }

  // --- Gabled roof as extruded triangular prism ---
  function createRoof(name, width, depth, height, mat) {
    const hw = width / 2;
    const hd = depth / 2;
    const shape = [v3(-hw, 0, 0), v3(0, height, 0), v3(hw, 0, 0)];
    const path  = [v3(0, 0, -hd), v3(0, 0, hd)];
    const mesh = BABYLON.MeshBuilder.ExtrudeShape(name, {
      shape, path, cap: BABYLON.Mesh.CAP_ALL, updatable: false
    }, state.scene);
    if (mat) mesh.material = mat;
    mesh.receiveShadows = true;
    return mesh;
  }

  // --- Lantern (emissive sphere + point light + glow) ---
  function addLantern(x, y, z, intensity, range) {
    const scene = state.scene;
    const mat = new BABYLON.StandardMaterial("lmat_" + x + "_" + y, scene);
    mat.diffuseColor  = c3("#f5d3a0");
    mat.emissiveColor = c3("#ebae55");

    const sphere = BABYLON.MeshBuilder.CreateSphere("lantern_" + x + "_" + y, { diameter: 0.56 }, scene);
    sphere.position = v3(x, y, z);
    sphere.material = mat;
    if (state.glowLayer) state.glowLayer.addIncludedOnlyMesh(sphere);

    const light = new BABYLON.PointLight("ll_" + x + "_" + y, v3(x, y, z), scene);
    light.diffuse = c3("#f3b867");
    light.intensity = intensity !== undefined ? intensity : 0.8;
    light.range = range !== undefined ? range : 30;
    return { sphere, light };
  }

  // --- Rope line with sag ---
  function addRopeLine(name, ax, ay, az, bx, by, bz, sag) {
    const pts = [];
    const mx = (ax + bx) / 2, my = Math.min(ay, by) - (sag || 0.75), mz = (az + bz) / 2;
    for (let i = 0; i <= 18; i++) {
      const t = i / 18, mt = 1 - t;
      pts.push(v3(mt * mt * ax + 2 * mt * t * mx + t * t * bx,
                  mt * mt * ay + 2 * mt * t * my + t * t * by,
                  mt * mt * az + 2 * mt * t * mz + t * t * bz));
    }
    const line = BABYLON.MeshBuilder.CreateLines(name, { points: pts }, state.scene);
    line.color = new BABYLON.Color3(0.55, 0.46, 0.32);
    line.alpha = 0.9;
    line.isPickable = false;
    return line;
  }

  // --- Sky ---
  function buildSky() {
    const skyMat = new BABYLON.SkyMaterial("skyMat", state.scene);
    skyMat.backFaceCulling = false;
    skyMat.turbidity        = 14;
    skyMat.luminance        = 0.85;
    skyMat.inclination      = 0.04;   // sun just above horizon = dusk glow
    skyMat.azimuth          = 0.28;
    skyMat.rayleigh         = 2.8;
    skyMat.mieCoefficient   = 0.006;
    skyMat.mieDirectionalG  = 0.98;

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 2400 }, state.scene);
    skybox.material = skyMat;
    skybox.infiniteDistance = true;
    skybox.isPickable = false;
    return { skybox, skyMat };
  }

  // --- Lights + shadow generator ---
  function buildLights() {
    const scene = state.scene;

    const hemi = new BABYLON.HemisphericLight("hemi", v3(0, 1, 0), scene);
    hemi.diffuse      = c3("#7a9ab8");
    hemi.groundColor  = c3("#110d08");
    hemi.intensity    = 0.40;

    const moon = new BABYLON.DirectionalLight("moon", v3(-0.55, -0.78, 0.28), scene);
    moon.diffuse    = c3("#ccd8f0");
    moon.intensity  = 1.05;
    moon.position   = v3(-72, 108, 18);

    const shadowGen = new BABYLON.ShadowGenerator(2048, moon);
    shadowGen.usePercentageCloserFiltering = true;
    shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
    shadowGen.bias = 0.001;

    const warm = new BABYLON.DirectionalLight("warmFill", v3(0.75, -0.35, -0.9), scene);
    warm.diffuse   = c3("#d59259");
    warm.intensity = 0.38;

    [
      { x: -38, y: 5,  z: 55, hex: "#f27a1a", i: 0.38, r: 60 },
      { x:  12, y: 4,  z: 50, hex: "#e87428", i: 0.28, r: 50 },
      { x:  46, y: 4,  z: 65, hex: "#f09030", i: 0.22, r: 42 }
    ].forEach(({ x, y, z, hex, i, r }) => {
      const pl = new BABYLON.PointLight("fill_" + x, v3(x, y, z), scene);
      pl.diffuse    = c3(hex);
      pl.intensity  = i;
      pl.range      = r;
    });

    return shadowGen;
  }

  // --- Ground + water ---
  function buildGround(shadowGen) {
    const scene = state.scene;

    const cobMat = makePBR("cob", "cobble", 1.0, "#7d736d");
    const cobbles = BABYLON.MeshBuilder.CreateGround("cobbles", { width: 260, height: 180 }, scene);
    cobbles.position = v3(0, 0, 58);
    cobbles.material = cobMat;
    cobbles.receiveShadows = true;

    const wetMat = makePBR("wet", "cobble", 0.38, "#556271");
    wetMat.metallic = 0.04;
    const wetStrip = BABYLON.MeshBuilder.CreateGround("wetStrip", { width: 190, height: 34 }, scene);
    wetStrip.position = v3(14, 0.03, 26);
    wetStrip.material = wetMat;
    wetStrip.receiveShadows = true;

    const quayMat = makePBR("quay", "stone", 1.0, "#8a847e");
    const quayTop = BABYLON.MeshBuilder.CreateBox("quayTop", { width: 208, height: 3.6, depth: 22 }, scene);
    quayTop.position = v3(12, 1.8, 22);
    quayTop.material = quayMat;
    quayTop.receiveShadows = true;
    shadowGen.addShadowCaster(quayTop);

    const quayWallMat = makePBR("quayWall", "stone", 1.0, "#756d66");
    const quayWall = BABYLON.MeshBuilder.CreateBox("quayWall", { width: 208, height: 15, depth: 5 }, scene);
    quayWall.position = v3(12, 4.5, 8);
    quayWall.material = quayWallMat;
    quayWall.receiveShadows = true;
    shadowGen.addShadowCaster(quayWall);

    // Water
    if (typeof BABYLON.WaterMaterial !== "undefined") {
      const waterMesh = BABYLON.MeshBuilder.CreateGround("water",
        { width: 420, height: 320, subdivisions: 4 }, scene);
      waterMesh.position = v3(28, -0.45, -96);
      const wm = new BABYLON.WaterMaterial("waterMat", scene, new BABYLON.Vector2(512, 512));
      wm.backFaceCulling  = false;
      wm.bumpHeight       = 0.28;
      wm.waveHeight       = 0.14;
      wm.waveLength       = 0.07;
      wm.windForce        = 10;
      wm.windDirection    = new BABYLON.Vector2(0.5, 0.8);
      wm.waterColor       = c3("#11293d");
      wm.waterColor2      = c3("#2a5269");
      wm.colorBlendFactor = 0.22;
      wm.bumpSuperimpose  = true;
      waterMesh.material  = wm;
      state.waterMat = wm;
      state.waterMesh = waterMesh;
    } else {
      const wm = new BABYLON.StandardMaterial("waterMat", scene);
      wm.diffuseColor  = c3("#11293d");
      wm.specularColor = c3("#4a7888");
      wm.specularPower = 64;
      const waterMesh = BABYLON.MeshBuilder.CreateGround("water", { width: 420, height: 320 }, scene);
      waterMesh.position = v3(28, -0.45, -96);
      waterMesh.material = wm;
    }
  }

  // --- City walls + lighthouse ---
  function buildWalls(shadowGen) {
    const scene = state.scene;
    const sm = makePBR("wallStone", "stone", 1.0, "#7e756a");

    const wall = BABYLON.MeshBuilder.CreateBox("cityWall", { width: 196, height: 26, depth: 9 }, scene);
    wall.position = v3(-4, 13, 86);
    wall.material = sm;
    wall.receiveShadows = true;
    shadowGen.addShadowCaster(wall);

    [-76, -20, 48].forEach((x, i) => {
      const t = BABYLON.MeshBuilder.CreateCylinder("wTower_" + i,
        { diameter: 13.2, height: 30, tessellation: 10 }, scene);
      t.position = v3(x, 15, 86);
      t.material = sm;
      t.receiveShadows = true;
      shadowGen.addShadowCaster(t);
    });

    const lhMat = makePBR("lhMat", null, 0.92, "#b9b4aa");
    const lhBody = BABYLON.MeshBuilder.CreateCylinder("lhBody",
      { diameterTop: 10.8, diameterBottom: 15.6, height: 42, tessellation: 16 }, scene);
    lhBody.position = v3(106, 21, -110);
    lhBody.material = lhMat;
    shadowGen.addShadowCaster(lhBody);

    const lrMat = makePBR("lrMat", null, 0.88, "#605244");
    const lr = BABYLON.MeshBuilder.CreateCylinder("lr",
      { diameter: 10, height: 7, tessellation: 12 }, scene);
    lr.position = v3(106, 44, -110);
    lr.material = lrMat;
    shadowGen.addShadowCaster(lr);
    addLantern(106, 46.6, -110, 1.9, 60);
  }

  // --- Docks ---
  function buildDock(cfg, shadowGen) {
    const scene = state.scene;
    const deckMat  = makePBR("dkWood", "wood", 1.0, cfg.type === "main" ? "#725037" : "#69482f");
    const braceMat = makePBR("dkBrace", "wood", 1.0, "#4d3424");

    const offsetZ = cfg.z - cfg.length / 2;
    const deck = BABYLON.MeshBuilder.CreateBox("deck_" + cfg.x,
      { width: cfg.width, height: 1.4, depth: cfg.length }, scene);
    deck.position = v3(cfg.x, 0.85, offsetZ + cfg.length / 2);
    deck.material = deckMat;
    deck.receiveShadows = true;
    shadowGen.addShadowCaster(deck);

    for (let i = -cfg.length / 2 + 3; i <= cfg.length / 2 - 3; i += 7.2) {
      const wz = offsetZ + cfg.length / 2 + i;
      [-cfg.width / 2 + 1.15, cfg.width / 2 - 1.15].forEach((sx, si) => {
        const post = BABYLON.MeshBuilder.CreateBox("post_" + cfg.x + "_" + i + "_" + si,
          { width: 1.15, height: 6.2, depth: 1.15 }, scene);
        post.position = v3(cfg.x + sx, 3.1, wz);
        post.material = braceMat;
        shadowGen.addShadowCaster(post);
      });

      if (i < cfg.length / 2 - 9) {
        const nextWz = wz + 7.2;
        addRopeLine("rope_L_" + cfg.x + "_" + i,
          cfg.x - cfg.width / 2 + 1.15, 5.3, wz,
          cfg.x - cfg.width / 2 + 1.15, 5.3, nextWz, 0.75);
        addRopeLine("rope_R_" + cfg.x + "_" + i,
          cfg.x + cfg.width / 2 - 1.15, 5.3, wz,
          cfg.x + cfg.width / 2 - 1.15, 5.3, nextWz, 0.75);
      }
    }

    if (cfg.type === "main") {
      for (let step = 0; step < 3; step++) {
        const stair = BABYLON.MeshBuilder.CreateBox("stair_" + step,
          { width: 3.8, height: 0.45, depth: 2.4 }, scene);
        stair.position = v3(cfg.x, 0.25 + step * 0.42,
          offsetZ + cfg.length - 4.8 - step * 2.2);
        stair.material = deckMat;
      }
    }
  }

  // --- Buildings (non-inn) ---
  function buildBuilding(spec, shadowGen) {
    const scene = state.scene;
    const uid = spec.position.x + "_" + spec.position.z;

    const wallMat   = makePBR("wall_" + uid,    "plaster", 0.95, spec.plaster);
    const timberMat = makePBR("timber_" + uid,  "wood",    0.98, spec.timber);
    const roofMat   = makePBR("roof_" + uid,    "roof",    1.0,  spec.roof);
    const recessMat = new BABYLON.StandardMaterial("recess_" + uid, scene);
    recessMat.diffuseColor = c3("#150f0b");
    const frameMat = new BABYLON.StandardMaterial("frame_" + uid, scene);
    frameMat.diffuseColor = c3("#5b4333");

    const lowerH    = spec.height * 0.52;
    const upperH    = spec.height - lowerH;
    const jetty     = spec.kind === "shed" ? 0 : spec.kind === "warehouse" ? 0.9 : 1.6;
    const upperD    = spec.depth + jetty;
    const lFZ       = spec.depth / 2;
    const uFZ       = spec.depth / 2 + jetty;
    const px        = spec.position.x;
    const py        = spec.position.y;
    const pz        = spec.position.z;

    function box(name, w, h, d, ox, oy, oz, mat) {
      const m = BABYLON.MeshBuilder.CreateBox(name + "_" + uid,
        { width: w, height: h, depth: d }, scene);
      m.position = v3(px + ox, py + oy, pz + oz);
      if (mat) m.material = mat;
      m.receiveShadows = true;
      shadowGen.addShadowCaster(m);
      return m;
    }

    // Lower + upper jettied sections
    box("lower", spec.width, lowerH, spec.depth,  0, lowerH / 2, 0, wallMat);
    box("upper", spec.width, upperH, upperD,       0, lowerH + upperH / 2, jetty / 2, wallMat);

    // Jetty slab
    if (jetty > 0) {
      box("jettySlab", spec.width + 0.6, 0.52, jetty + 0.4,
        0, lowerH, lFZ + jetty / 2, timberMat);
    }

    // Roof
    const roofMesh = createRoof("roof_" + uid, spec.width + 1.8, upperD + 1.4, spec.roofHeight, roofMat);
    roofMesh.position = v3(px, py + spec.height, pz + jetty / 2);

    // Ridge beam
    box("ridge", spec.width + 2.2, 0.38, 0.38,
      0, spec.height + spec.roofHeight - 0.1, jetty / 2, timberMat);

    // Chimney stacks
    const chimneyMat = makePBR("chimney_" + uid, "stone", 1.0, spec.plaster);
    const chimneyOffsets = spec.kind === "shed"
      ? [{ cx: spec.width * 0.18, cz: 0 }]
      : [{ cx: spec.width * 0.22, cz: -spec.depth * 0.08 },
         { cx: -spec.width * 0.26, cz: spec.depth * 0.06 }];
    chimneyOffsets.forEach((cp, ci) => {
      const sH = spec.roofHeight + 3.2;
      box("chimney_" + ci, 1.35, sH, 1.35,
        cp.cx, spec.height + sH / 2, cp.cz + jetty / 2, chimneyMat);
      box("chimneyCap_" + ci, 2.1, 0.3, 2.1,
        cp.cx, spec.height + sH + 0.15, cp.cz + jetty / 2, timberMat);
    });

    // Corner posts (lower + upper)
    for (let side = -1; side <= 1; side += 2) {
      box("postL_" + side, 0.62, lowerH + 0.3, 0.52,
        side * (spec.width / 2 - 0.58), lowerH / 2, lFZ + 0.12, timberMat);
      box("postU_" + side, 0.62, upperH + 0.3, 0.52,
        side * (spec.width / 2 - 0.58), lowerH + upperH / 2, uFZ + 0.12, timberMat);
    }

    // Horizontal belts
    box("beltJ", spec.width + 0.5, 0.62, 0.5, 0, lowerH, lFZ + 0.18, timberMat);
    box("beltE", spec.width + 0.5, 0.55, 0.48, 0, spec.height - 1.6, uFZ + 0.14, timberMat);

    // Diagonal X brace on lower facade
    const dW = spec.width * 0.72, dH = lowerH * 0.76;
    const dLen = Math.hypot(dW, dH), dAngle = Math.atan2(dW, dH);
    [-1, 1].forEach((dir, di) => {
      const d = box("diag_" + di, 0.4, dLen, 0.4, 0, lowerH * 0.46, lFZ + 0.12, timberMat);
      d.rotation.z = dir * dAngle;
    });

    // Windows: frame + dark inset + glowing pane + sill
    const winMat = new BABYLON.StandardMaterial("win_" + uid, scene);
    winMat.diffuseColor  = c3("#f4c77a");
    winMat.emissiveColor = c3("#dc9840");

    const cols = Math.max(2, Math.round(spec.width / 5.5));
    [
      { startY: lowerH * 0.44, rows: 1, fz: lFZ },
      { startY: lowerH + upperH * 0.32, rows: Math.max(1, Math.round((upperH - 2) / 3.5)), fz: uFZ }
    ].forEach(({ startY, rows, fz }) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const wx = -spec.width / 2 + 2.6 + col * ((spec.width - 5.2) / Math.max(1, cols - 1));
          const wy = startY + row * 3.5;
          const wz = fz + 0.06;

          box("fr_" + row + "_" + col + "_" + fz, 1.72, 2.08, 0.3,
            wx, wy, wz, frameMat);

          const pane = BABYLON.MeshBuilder.CreatePlane("pane_" + row + "_" + col + "_" + uid,
            { width: 1.08, height: 1.54 }, scene);
          pane.position = v3(px + wx, py + wy, pz + wz + 0.09);
          pane.material = winMat;
          if (state.glowLayer) state.glowLayer.addIncludedOnlyMesh(pane);

          box("sill_" + row + "_" + col + "_" + fz, 1.84, 0.2, 0.48,
            wx, wy - 1.1, wz + 0.06, frameMat);
        }
      }
    });
  }

  // --- Inn hero complex ---
  function buildInnHero(cfg, shadowGen) {
    const scene = state.scene;
    const sideM    = makePBR("innSide",    "plaster", 0.96, "#977d62");
    const roofM    = makePBR("innRoof",    "roof",    1.0,  "#263241");
    const timberM  = makePBR("innTimber",  "wood",    0.98, "#4a3226");
    const chimneyM = makePBR("innChimney", "stone",   1.0,  "#938679");

    function mk(name, w, h, d, x, y, z, mat) {
      const b = BABYLON.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      b.position = v3(x, y, z);
      b.material = mat;
      b.receiveShadows = true;
      shadowGen.addShadowCaster(b);
      return b;
    }

    mk("innLW",   15, 18, 18, -54, 9, 32, sideM);
    mk("innRW",   15, 18, 16, -22, 9, 32, sideM);
    mk("innBody", 26, 18, 12, -38, 9, 31, sideM);

    const lr = createRoof("innLR", 17, 19, 8, roofM);
    lr.position = v3(-54, 18, 32);
    const rr = createRoof("innRR", 17, 17, 8, roofM);
    rr.position = v3(-22, 18, 32);
    const cr = createRoof("innCR", 28, 13, 6, roofM);
    cr.position = v3(-38, 18, 31);

    // Chimneys
    [{ x: -54, z: 26 }, { x: -22, z: 27 }, { x: -40, z: 29 }, { x: -34, z: 28 }].forEach((cp, i) => {
      mk("iChimney_" + i, 1.4, 13, 1.4, cp.x, 24.5, cp.z, chimneyM);
      mk("iChimneyCap_" + i, 2.2, 0.32, 2.2, cp.x, 31.15, cp.z, timberM);
    });

    // Terrace + bollards
    mk("innTerrace", 28, 1.2, 10, -38, 0.6, 53, timberM);
    for (let i = -3; i <= 3; i++) {
      mk("bollard_" + i, 0.6, 2.1, 0.6, -38 + i * 4, 1.05, 57, timberM);
      if (i < 3) {
        addRopeLine("bRope_" + i,
          -38 + i * 4, 2.2, 57, -38 + (i + 1) * 4, 2.2, 57, 0.35);
      }
    }

    // Facade card (if image exists)
    if (cfg.facadeImage) {
      const facadeTex = new BABYLON.Texture(cfg.facadeImage, scene);
      const facadeMat = new BABYLON.StandardMaterial("facadeMat", scene);
      facadeMat.diffuseTexture = facadeTex;
      facadeMat.backFaceCulling = false;
      const facade = BABYLON.MeshBuilder.CreatePlane("facade",
        { width: 42, height: 30 }, scene);
      facade.position = v3(-38, 15.5, 40.9);
      facade.material = facadeMat;
    }

    // Lanterns
    addLantern(-45, 6.4, 48.5, 0.75, 24);
    addLantern(-31, 6.4, 48.5, 0.75, 24);
    addLantern(-39, 10.6, 43.4, 0.55, 18);
  }

  // --- Ships ---
  function buildShip(spec, shadowGen) {
    const scene = state.scene;
    const parent = new BABYLON.TransformNode("ship_" + spec.name, scene);
    parent.position = v3(spec.position.x, spec.position.y, spec.position.z);
    parent.rotation.y = spec.heading;

    const s = spec.scale;
    const hullMat = makePBR("hull_" + spec.name, null, 0.95, spec.hull);
    const deckMat = makePBR("deck_" + spec.name, "wood", 1.0, "#725037");
    const mastMat = makePBR("mast_" + spec.name, null, 1.0, "#4a3426");
    const sailMat = new BABYLON.StandardMaterial("sail_" + spec.name, scene);
    sailMat.diffuseColor    = c3(spec.sail);
    sailMat.backFaceCulling = false;

    function child(name, w, h, d, ox, oy, oz, mat) {
      const b = BABYLON.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
      b.position = v3(ox, oy, oz);
      b.parent   = parent;
      b.material = mat;
      shadowGen.addShadowCaster(b);
      return b;
    }

    child("hull",  17 * s, 7 * s,   5.5 * s, 0, 0, 0, hullMat);
    child("deck",  11.6 * s, 0.7, 4.1 * s,   0, 3.8 * s, 0, deckMat);
    child("stern", 3.9 * s, 3.1 * s, 3 * s, -1.6 * s, 5.5 * s, 0, hullMat);

    [
      { mx: 2.1, mh: 14.5, sw: 5.4, sh: 7.2 },
      { mx: -3.6, mh: 10.6, sw: 4.2, sh: 5.8 }
    ].forEach((ms, mi) => {
      const mast = BABYLON.MeshBuilder.CreateCylinder("mast_" + spec.name + "_" + mi, {
        diameterTop: 0.36 * s, diameterBottom: 0.52 * s,
        height: ms.mh * s, tessellation: 8
      }, scene);
      mast.position = v3(ms.mx * s, (ms.mh / 2 + 3.6) * s, 0);
      mast.parent   = parent;
      mast.material = mastMat;
      shadowGen.addShadowCaster(mast);

      const sail = BABYLON.MeshBuilder.CreatePlane("sail_" + spec.name + "_" + mi,
        { width: ms.sw * s, height: ms.sh * s }, scene);
      sail.position  = v3(ms.mx * s, (ms.mh / 2 + 3.6) * s, 0);
      sail.parent    = parent;
      sail.material  = sailMat;
    });

    // Ship lantern (glowing)
    const lMat = new BABYLON.StandardMaterial("slMat_" + spec.name, scene);
    lMat.emissiveColor = c3(spec.lantern || "#e0a454");
    const lan = BABYLON.MeshBuilder.CreateSphere("slan_" + spec.name, { diameter: 0.38 }, scene);
    lan.position = v3(4.2 * s, 5.15 * s, 1.6 * s);
    lan.parent   = parent;
    lan.material = lMat;
    if (state.glowLayer) state.glowLayer.addIncludedOnlyMesh(lan);

    state.bobbers.push({ node: parent, baseY: spec.position.y, seed: Math.random() * Math.PI * 2 });
  }

  // --- Props ---
  function buildProps(cfg, shadowGen) {
    const scene = state.scene;
    const crateMat = makePBR("crate", "wood", 1.0, "#7c5637");
    const barrelMat = makePBR("barrel", "wood", 1.0, "#5b402b");
    const postMat  = makePBR("lampPost", "wood", 1.0, "#413021");

    cfg.props.crates.forEach((c, i) => {
      const b = BABYLON.MeshBuilder.CreateBox("crate_" + i,
        { width: c.w, height: c.h, depth: c.d }, scene);
      b.position  = v3(c.x, c.h / 2, c.z);
      b.rotation.y = (i % 3) * 0.18;
      b.material  = crateMat;
      b.receiveShadows = true;
      shadowGen.addShadowCaster(b);
    });

    cfg.props.barrels.forEach((b, i) => {
      const cyl = BABYLON.MeshBuilder.CreateCylinder("barrel_" + i, {
        diameterTop: b.r * 2, diameterBottom: b.r * 2.12,
        height: b.h, tessellation: 14
      }, scene);
      cyl.position  = v3(b.x, b.h / 2, b.z);
      cyl.rotation.y = i * 0.2;
      cyl.material  = barrelMat;
      cyl.receiveShadows = true;
      shadowGen.addShadowCaster(cyl);
    });

    cfg.props.lampPosts.forEach((p, i) => {
      const pole = BABYLON.MeshBuilder.CreateCylinder("pole_" + i, {
        diameterTop: 0.44, diameterBottom: 0.6, height: p.h, tessellation: 8
      }, scene);
      pole.position = v3(p.x, p.h / 2, p.z);
      pole.material = postMat;
      shadowGen.addShadowCaster(pole);

      const arm = BABYLON.MeshBuilder.CreateBox("arm_" + i,
        { width: 2.3, height: 0.2, depth: 0.2 }, scene);
      arm.position = v3(p.x + 1.1, p.h - 0.7, p.z);
      arm.material = postMat;

      addLantern(p.x + 1.95, p.h - 1.22, p.z, 0.95, 28);
    });

    cfg.props.marketAwnings.forEach((a, i) => {
      const mat = makePBR("awn_" + i, null, 0.92, a.color);
      const c = BABYLON.MeshBuilder.CreateBox("awning_" + i,
        { width: a.w, height: 0.28, depth: a.d }, scene);
      c.position  = v3(a.x, 5.45, a.z);
      c.rotation.z = i % 2 ? -0.04 : 0.05;
      c.material  = mat;
      shadowGen.addShadowCaster(c);
    });

    // Crane
    const craneMat = makePBR("crane", "wood", 1.0, "#55402d");
    const craneBase = BABYLON.MeshBuilder.CreateBox("craneBase",
      { width: 10, height: 2.8, depth: 10 }, scene);
    craneBase.position = v3(34, 1.5, 12);
    craneBase.material = craneMat;
    shadowGen.addShadowCaster(craneBase);
  }

  // --- Atmosphere (mist planes) ---
  function buildAtmosphere() {
    const scene = state.scene;
    [
      { x: -14, y: 10, z: 18,  w: 96,  h: 34, a: 0.14 },
      { x:  36, y: 12, z: -4,  w: 120, h: 40, a: 0.16 },
      { x:  66, y: 18, z: -54, w: 150, h: 46, a: 0.18 }
    ].forEach((e, i) => {
      const mat = new BABYLON.StandardMaterial("fogMat_" + i, scene);
      mat.diffuseColor = c3("#b3bfd0");
      mat.alpha        = e.a;
      mat.backFaceCulling = false;
      mat.disableLighting = true;
      const fog = BABYLON.MeshBuilder.CreatePlane("fogPlane_" + i,
        { width: e.w, height: e.h }, scene);
      fog.position  = v3(e.x, e.y, e.z);
      fog.rotation.y = -0.12 - i * 0.08;
      fog.material  = mat;
      fog.isPickable = false;
      state.fogMeshes.push({ mesh: fog, seed: i * 0.9, baseMat: mat, baseAlpha: e.a });
    });
  }

  // --- Hotspot rings ---
  function buildHotspots(cfg) {
    const scene = state.scene;
    cfg.hotspots.forEach((hs) => {
      const rm = new BABYLON.StandardMaterial("hsRingMat_" + hs.id, scene);
      rm.diffuseColor  = c3("#d4af37");
      rm.emissiveColor = c3("#d4af37");
      rm.alpha         = 0.4;
      const ring = BABYLON.MeshBuilder.CreateTorus("hsRing_" + hs.id,
        { diameter: 4.6, thickness: 0.24, tessellation: 48 }, scene);
      ring.position  = v3(hs.position.x, 0.36, hs.position.z);
      ring.rotation.x = Math.PI / 2;
      ring.material  = rm;

      const target = BABYLON.MeshBuilder.CreateSphere("hsTgt_" + hs.id,
        { diameter: 5.6 }, scene);
      target.position  = v3(hs.position.x, hs.position.y, hs.position.z);
      target.isPickable = true;
      target.isVisible  = false;
      target.metadata   = { hotspot: hs };
      state.hotspotMeshes.push(target);
    });
  }

  // --- Post-processing ---
  function setupPostProcessing(camera) {
    const scene = state.scene;

    // SSAO2 — real screen-space ambient occlusion
    try {
      const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, {
        ssaoRatio: 0.5, blurRatio: 0.5
      }, [camera]);
      ssao.radius        = 3.5;
      ssao.totalStrength = 1.4;
      ssao.base          = 0.1;
      ssao.maxZ          = 250;
      ssao.minZAspect    = 0.2;
      ssao.expensiveBlur = true;
    } catch (e) {
      // SSAO2 unavailable on this device — skip gracefully
    }

    // Default pipeline — bloom + ACESFilmic tone mapping + vignette
    const pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    pipeline.bloomEnabled       = true;
    pipeline.bloomThreshold     = 0.72;
    pipeline.bloomWeight        = 0.38;
    pipeline.bloomKernel        = 64;
    pipeline.bloomScale         = 0.5;
    pipeline.imageProcessingEnabled = true;
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType =
      BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    pipeline.imageProcessing.exposure  = 1.15;
    pipeline.imageProcessing.contrast  = 1.28;
    pipeline.imageProcessing.vignetteEnabled    = true;
    pipeline.imageProcessing.vignetteWeight     = 2.8;
    pipeline.imageProcessing.vignetteColor      = new BABYLON.Color4(0, 0, 0, 0);
    pipeline.imageProcessing.vignetteBlendMode  =
      BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
  }

  // --- HUD ---
  function updateOverlayInfo() {
    const cfg = state.config;
    document.getElementById("scene-city-name").textContent = cfg.cityName;
    document.getElementById("scene-name").textContent      = cfg.sceneName;
    document.getElementById("scene-subtitle").textContent  = cfg.sceneSubtitle;
    document.getElementById("scene-tagline").textContent   = cfg.tagline;

    const loreEl = document.getElementById("scene-lore");
    loreEl.innerHTML = "";
    cfg.lore.forEach((t) => {
      const p = document.createElement("p");
      p.textContent = t;
      loreEl.appendChild(p);
    });

    const ctrlEl = document.getElementById("scene-controls");
    ctrlEl.innerHTML = "";
    cfg.controls.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ctrlEl.appendChild(li);
    });

    const mm = document.getElementById("scene-minimap");
    const fc = document.getElementById("scene-focus");
    mm.onload = () => {
      fc.style.left    = cfg.mapFocus.x + "%";
      fc.style.top     = cfg.mapFocus.y + "%";
      fc.style.opacity = "1";
    };
    mm.src = cfg.cityMapImage;
  }

  function resetCamera(camera) {
    const s = state.config.playerStart;
    camera.position = v3(s.x, s.y, s.z);
    if (s.lookAt) camera.setTarget(v3(s.lookAt.x, s.lookAt.y, s.lookAt.z));
  }

  function bindUIEvents(canvas, camera) {
    document.getElementById("reset-camera").addEventListener("click", () => resetCamera(camera));
    document.getElementById("toggle-lore").addEventListener("click", () => {
      document.getElementById("lore-panel").classList.toggle("collapsed");
    });
    document.getElementById("toggle-minimap").addEventListener("click", () => {
      document.getElementById("minimap-panel").classList.toggle("collapsed");
    });
    window.addEventListener("keydown", (e) => {
      if (e.code === "KeyR") resetCamera(camera);
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") camera.speed = 28;
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") camera.speed = 14;
    });

    // Hotspot tooltips
    state.scene.onPointerObservable.add((pi) => {
      if (pi.type !== BABYLON.PointerEventTypes.POINTERMOVE) return;
      const hit = state.scene.pick(
        state.scene.pointerX, state.scene.pointerY,
        (m) => !!(m.metadata && m.metadata.hotspot)
      );
      if (hit.hit && hit.pickedMesh) {
        const hs = hit.pickedMesh.metadata.hotspot;
        const tt = state.tooltip;
        tt.classList.add("visible");
        tt.style.left = state.scene.pointerX + 18 + "px";
        tt.style.top  = state.scene.pointerY + 18 + "px";
        document.getElementById("hotspot-name").textContent = hs.name;
        document.getElementById("hotspot-type").textContent = hs.type;
        document.getElementById("hotspot-desc").textContent = hs.description;
      } else if (state.tooltip) {
        state.tooltip.classList.remove("visible");
      }
    });
  }

  // --- Boot ---
  function boot() {
    const params = new URLSearchParams(window.location.search);
    const cityId = (params.get("city") || "basctdelm").toLowerCase();
    state.config = window.CITY_SCENE_DATA[cityId] || window.CITY_SCENE_DATA.basctdelm;
    const cfg = state.config;

    const canvas = document.getElementById("scene-canvas");
    const engine = new BABYLON.Engine(canvas, true,
      { preserveDrawingBuffer: true, stencil: true });
    state.engine = engine;

    const scene = new BABYLON.Scene(engine);
    state.scene = scene;
    scene.clearColor = new BABYLON.Color4(0.04, 0.05, 0.07, 1);
    scene.fogMode    = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.0072;
    scene.fogColor   = c3("#0e1620");

    // Camera — W=forward, S=back, A=left, D=right
    const sp = cfg.playerStart;
    const camera = new BABYLON.UniversalCamera("cam", v3(sp.x, sp.y, sp.z), scene);
    if (sp.lookAt) camera.setTarget(v3(sp.lookAt.x, sp.lookAt.y, sp.lookAt.z));
    camera.minZ             = 0.1;
    camera.maxZ             = 1200;
    camera.speed            = 14;
    camera.angularSensibility = 480;
    camera.inertia          = 0.45;
    camera.keysUp    = [87]; // W  → forward
    camera.keysDown  = [83]; // S  → back
    camera.keysLeft  = [65]; // A  → left
    camera.keysRight = [68]; // D  → right
    camera.attachControl(canvas, true);

    // Glow layer created first so meshes can register during scene build
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 0.95;
    state.glowLayer = gl;

    createTextures();

    const { skybox, skyMat } = buildSky();
    const shadowGen = buildLights();
    buildGround(shadowGen);
    buildWalls(shadowGen);
    buildAtmosphere();
    buildInnHero(cfg, shadowGen);
    cfg.docks.forEach((dock) => buildDock(dock, shadowGen));
    cfg.buildings.forEach((bld) => {
      if (bld.kind !== "inn") buildBuilding(bld, shadowGen);
      if (Array.isArray(bld.lanterns)) {
        bld.lanterns.forEach((l) => addLantern(l.x, l.y, l.z, 0.72, 26));
      }
    });
    cfg.ships.forEach((ship) => buildShip(ship, shadowGen));
    buildProps(cfg, shadowGen);
    buildHotspots(cfg);

    // Give water material the sky for reflections
    if (state.waterMat && state.waterMat.addToRenderList) {
      state.waterMat.addToRenderList(skybox);
    }

    setupPostProcessing(camera);

    state.tooltip = document.getElementById("hotspot-tooltip");
    updateOverlayInfo();
    bindUIEvents(canvas, camera);

    // Render loop
    const clock = { last: performance.now() };
    engine.runRenderLoop(() => {
      const now   = performance.now();
      const delta = Math.min((now - clock.last) / 1000, 0.033);
      clock.last  = now;
      state.elapsed += delta;

      state.bobbers.forEach((entry) => {
        const t = state.elapsed + entry.seed;
        entry.node.position.y = entry.baseY + Math.sin(t * 1.15) * 0.24;
        entry.node.rotation.z = Math.sin(t * 0.70) * 0.02;
      });

      state.fogMeshes.forEach((entry, i) => {
        entry.mesh.position.x += Math.sin(state.elapsed * 0.12 + entry.seed) * 0.012;
        entry.baseMat.alpha = entry.baseAlpha + Math.sin(state.elapsed * 0.6 + i) * 0.03;
      });

      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());
    document.getElementById("loading-screen").classList.add("hidden");
  }

  return { boot };
})();
