/* The Bellows: Basctdelm's underground district beneath the High District.
 *
 * Lore (Basctdelm gazetteer): the Loop roads descend west into Bellow's Lead,
 * a 20 ft (6 m) carved tunnel with side passages to carved shops and taverns;
 * grey stone and shadow, lanterns kept low, cool damp air beside the lake
 * called The Void. The cavern is modelled on the Heroes of Emberstran
 * chapter 34 art: Gothic facades carved into the rock along a curving,
 * balustraded promenade above misty black water, under a glittering ceiling.
 *
 * The district sits 45 m below the High District. Walking into the Lead's
 * surface arch fades you down; walking back up the Lead returns you.
 */
(function () {
  'use strict';
  // The city builds asynchronously (it waits for the building kit), so start once it is ready.
  if (window.BasctdelmWalk) run(); else window.addEventListener('basctdelm-ready', run, { once: true });
  function run() {
  const W = window.BasctdelmWalk;
  if (!W || !window.BABYLON) return;
  const { scene, camera, map, hash, mats, collisions, hitsCollider, roadClearance, shadows } = W;
  const V3 = BABYLON.Vector3;
  const rgb = hex => BABYLON.Color3.FromHexString(hex);
  const origin = map(18, 27), FLOOR = -45;
  const L = (x, y, z) => new V3(origin.x + x, FLOOR + y, origin.z + z);
  const bellowsMeshes = [];
  const track = m => { m.isPickable = false; bellowsMeshes.push(m); return m; };

  // ------------------------------------------------------------ materials
  const DIR = 'images/city-scenes/basctdelm/materials/';
  function stoneMat(name, asset, tint, bump = .7) {
    const m = new BABYLON.PBRMaterial(name, scene);
    m.albedoTexture = new BABYLON.Texture(DIR + asset + '-diff.jpg', scene);
    m.bumpTexture = new BABYLON.Texture(DIR + asset + '-normal.jpg', scene);
    for (const t of [m.albedoTexture, m.bumpTexture]) { t.wrapU = t.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; }
    m.bumpTexture.level = bump; m.albedoColor = rgb(tint); m.metallic = 0; m.roughness = .92;
    m.usePhysicalLightFalloff = false; m.maxSimultaneousLights = 6;
    return m;
  }
  const B = {
    rock: stoneMat('Bellows cavern rock', 'medieval_wall_02', '#8a8278', 1.2),
    carved: stoneMat('Bellows carved stone', 'medieval_wall_02', '#a39886'),
    ashlar: stoneMat('Bellows dressed ashlar', 'medieval_blocks_05', '#9a917f'),
    setts: stoneMat('Bellows promenade setts', 'medieval_blocks_05', '#8a8173'),
    timber: stoneMat('Bellows dark oak', 'dark_wooden_planks', '#7d6a5a')
  };
  const glow = new BABYLON.StandardMaterial('Bellows lamplit window', scene);
  glow.diffuseColor = BABYLON.Color3.Black(); glow.emissiveColor = rgb('#ffa94d'); glow.specularColor = BABYLON.Color3.Black();
  const dimGlass = new BABYLON.StandardMaterial('Bellows dark window', scene);
  dimGlass.diffuseColor = rgb('#0b0f13'); dimGlass.emissiveColor = rgb('#141a20'); dimGlass.specularColor = rgb('#5b6b78');
  const lamp = new BABYLON.StandardMaterial('Bellows lantern flame', scene);
  lamp.diffuseColor = BABYLON.Color3.Black(); lamp.emissiveColor = rgb('#d9913e');
  const iron = new BABYLON.StandardMaterial('Bellows ironwork', scene);
  iron.diffuseColor = rgb('#1b1a19'); iron.specularColor = rgb('#3a3a3a'); iron.maxSimultaneousLights = 6;
  const shadowMat = new BABYLON.StandardMaterial('Bellows doorway shadow', scene);
  shadowMat.diffuseColor = rgb('#060505'); shadowMat.specularColor = BABYLON.Color3.Black();
  const tileSize = new Map([[B.rock, 4], [B.carved, 2.4], [B.ashlar, 2.2], [B.setts, 1.6], [B.timber, 1.4]]);

  // -------------------------------------------- local geometry batcher
  // Same approach as the surface city: one buffer per material, planar UVs in metres.
  const batches = new Map();
  function addPolygon(mat, verts, outward) {
    if (!batches.has(mat)) batches.set(mat, { p: [], n: [], uv: [], i: [] });
    const b = batches.get(mat), base = b.p.length / 3;
    let normal = V3.Cross(verts[1].subtract(verts[0]), verts[2].subtract(verts[0])).normalize();
    let order = verts.map((_, k) => k);
    if (V3.Dot(normal, outward) > 0) order = [0, ...order.slice(1).reverse()]; else normal = normal.scale(-1);
    const tile = tileSize.get(mat) || 2;
    order.forEach(k => {
      const v = verts[k]; b.p.push(v.x, v.y, v.z); b.n.push(normal.x, normal.y, normal.z);
      const ax = Math.abs(normal.x), ay = Math.abs(normal.y), az = Math.abs(normal.z);
      if (ay >= ax && ay >= az) b.uv.push(v.x / tile, v.z / tile); else if (ax >= az) b.uv.push(v.z / tile, v.y / tile); else b.uv.push(v.x / tile, v.y / tile);
    });
    for (let k = 1; k < verts.length - 1; k++) b.i.push(base, base + k, base + k + 1);
  }
  function addBox(mat, w, h, d, c, yaw) {
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    const at = (x, y, z) => new V3(c.x + x * cos + z * sin, c.y + y, c.z - x * sin + z * cos);
    const dir = (x, y, z) => new V3(x * cos + z * sin, y, -x * sin + z * cos);
    const X = w / 2, Y = h / 2, Z = d / 2;
    addPolygon(mat, [at(-X, -Y, Z), at(X, -Y, Z), at(X, Y, Z), at(-X, Y, Z)], dir(0, 0, 1));
    addPolygon(mat, [at(X, -Y, -Z), at(-X, -Y, -Z), at(-X, Y, -Z), at(X, Y, -Z)], dir(0, 0, -1));
    addPolygon(mat, [at(X, -Y, Z), at(X, -Y, -Z), at(X, Y, -Z), at(X, Y, Z)], dir(1, 0, 0));
    addPolygon(mat, [at(-X, -Y, -Z), at(-X, -Y, Z), at(-X, Y, Z), at(-X, Y, -Z)], dir(-1, 0, 0));
    addPolygon(mat, [at(-X, Y, Z), at(X, Y, Z), at(X, Y, -Z), at(-X, Y, -Z)], dir(0, 1, 0));
    addPolygon(mat, [at(-X, -Y, -Z), at(X, -Y, -Z), at(X, -Y, Z), at(-X, -Y, Z)], dir(0, -1, 0));
  }
  function flush() {
    batches.forEach((b, mat) => {
      const mesh = new BABYLON.Mesh(mat.name + ' (Bellows)', scene), d = new BABYLON.VertexData();
      d.positions = b.p; d.normals = b.n; d.uvs = b.uv; d.indices = b.i; d.applyToMesh(mesh);
      mesh.material = mat; track(mesh);
    });
    batches.clear();
  }
  // A local frame on a wall: x along it, y up, z out of it (toward the viewer).
  function frame(c, yaw) {
    const cos = Math.cos(yaw), sin = Math.sin(yaw);
    return {
      at: (x, y, z) => new V3(c.x + x * cos + z * sin, c.y + y, c.z - x * sin + z * cos),
      out: new V3(sin, 0, cos), yaw
    };
  }
  // Equilateral pointed arch: straight jambs up to the springing line, then
  // two arcs of radius w, each centred on the opposite springing point.
  function archPts(F, x0, y0, w, h, z) {
    const spring = y0 + Math.max(0, h - .866 * w), xl = x0 - w / 2, xr = x0 + w / 2;
    const pts = [F.at(xl, y0, z), F.at(xr, y0, z)];
    for (let k = 0; k <= 6; k++) { const t = k / 6 * Math.PI / 3; pts.push(F.at(xl + w * Math.cos(t), spring + w * Math.sin(t), z)); }
    for (let k = 1; k <= 6; k++) { const t = Math.PI * 2 / 3 + k / 6 * Math.PI / 3; pts.push(F.at(xr + w * Math.cos(t), spring + w * Math.sin(t), z)); }
    return pts;
  }
  function gothicOpening(F, x, y0, w, h, z, fill) {
    addPolygon(B.carved, archPts(F, x, y0 - .12, w + .5, h + .35, z), F.out);
    addPolygon(fill, archPts(F, x, y0, w, h, z + .04), F.out);
    if (fill !== shadowMat && fill !== B.timber) addBox(B.carved, .09, h * .82, .08, F.at(x, y0 + h * .41, z + .06), F.yaw);
  }
  const lanterns = [];
  function lantern(pos, withLight) {
    addBox(iron, .42, .08, .42, pos.add(new V3(0, .32, 0)), 0);
    const flame = track(BABYLON.MeshBuilder.CreateBox('Bellows lantern', { width: .3, height: .46, depth: .3 }, scene));
    flame.position = pos; flame.material = lamp;
    lanterns.push({ pos, withLight });
  }

  // --------------------------------------------------------------- cavern
  // An ellipsoid dome of rough rock; the west wall hugs the carved facades.
  const RX_W = 51, RX_E = 62, RZ = 41, H = 27, TUNNEL_X = -16, TUNNEL_HALF = 3.2;
  const tunnelA = Math.PI + Math.acos(-TUNNEL_X / RX_W);
  function buildDome() {
    const A = 144, E = 26, pos = [], uv = [], idx = [];
    for (let j = 0; j <= E; j++) {
      const e = j / E * Math.PI / 2;
      for (let i = 0; i <= A; i++) {
        const a = i / A * Math.PI * 2, rx = Math.cos(a) < 0 ? RX_W : RX_E;
        const wob = 1 + .025 * Math.sin(a * 7 + j * .9) + .02 * Math.sin(a * 17 + e * 11) + .025 * (hash(i * 31 + j * 7) - .5);
        const y = j === 0 ? -7 : H * Math.sin(e) * (1 + .04 * Math.sin(a * 5 + e * 3));
        pos.push(rx * Math.cos(e) * Math.cos(a) * wob + origin.x, FLOOR + y, RZ * Math.cos(e) * Math.sin(a) * wob + origin.z);
        uv.push(a * 46 / 4, (y + 7) / 4);
      }
    }
    const row = A + 1;
    for (let j = 0; j < E; j++) for (let i = 0; i < A; i++) {
      const a = (i + .5) / A * Math.PI * 2, y = H * Math.sin((j + .5) / E * Math.PI / 2);
      if (Math.abs(a - tunnelA) < .11 && y < 7.5) continue; // the Lead's mouth
      const k = j * row + i;
      idx.push(k, k + row, k + 1, k + 1, k + row, k + row + 1);
    }
    const mesh = new BABYLON.Mesh('The Bellows cavern', scene), d = new BABYLON.VertexData();
    d.positions = pos; d.indices = idx; d.uvs = uv; d.normals = [];
    BABYLON.VertexData.ComputeNormals(pos, idx, d.normals);
    // Light the inside of the dome: point every normal toward the cavern.
    for (let v = 0; v < pos.length; v += 3) {
      const cx = origin.x - pos[v], cy = FLOOR + 8 - pos[v + 1], cz = origin.z - pos[v + 2];
      if (d.normals[v] * cx + d.normals[v + 1] * cy + d.normals[v + 2] * cz < 0) { d.normals[v] *= -1; d.normals[v + 1] *= -1; d.normals[v + 2] *= -1; }
    }
    d.applyToMesh(mesh);
    B.rock.backFaceCulling = false;
    mesh.material = B.rock;
    B.rock.albedoTexture.uScale = B.rock.bumpTexture.uScale = 1;
    return track(mesh);
  }
  const dome = buildDome();

  // A glittering ceiling: thousands of tiny glow points set into the rock.
  (function stars() {
    const pos = [], idx = [];
    for (let k = 0; k < 2600; k++) {
      const a = hash(k * 1.37) * Math.PI * 2, e = .32 + hash(k * 2.71) * 1.2;
      if (e > Math.PI / 2) continue;
      const rx = Math.cos(a) < 0 ? RX_W : RX_E, f = .975;
      const c = new V3(origin.x + rx * Math.cos(e) * Math.cos(a) * f, FLOOR + H * Math.sin(e) * f, origin.z + RZ * Math.cos(e) * Math.sin(a) * f);
      const s = .05 + hash(k * 5.3) * .1, base = pos.length / 3;
      pos.push(c.x - s, c.y, c.z, c.x + s, c.y, c.z, c.x, c.y - s, c.z - s, c.x, c.y + s, c.z + s);
      idx.push(base, base + 2, base + 1, base, base + 1, base + 3);
    }
    const mesh = new BABYLON.Mesh('Bellows ceiling glitter', scene), d = new BABYLON.VertexData();
    d.positions = pos; d.indices = idx; d.normals = pos.map(() => 0); d.applyToMesh(mesh);
    const m = new BABYLON.StandardMaterial('Bellows glowworm light', scene);
    m.emissiveColor = rgb('#cfe4ff'); m.disableLighting = true; m.backFaceCulling = false;
    mesh.material = m; track(mesh);
  })();

  // ------------------------------------------------------ promenade + lake
  const PRX = 38, PRZ = 30, A0 = 2.0, A1 = 4.28;
  const E = (a, q) => new V3(PRX * q * Math.cos(a), 0, PRZ * q * Math.sin(a));
  const up = new V3(0, 1, 0);
  const STEPS = 90;
  for (let k = 0; k < STEPS; k++) {
    const a = A0 - .4 + (A1 - A0 + .8) * k / STEPS, b = A0 - .4 + (A1 - A0 + .8) * (k + 1) / STEPS;
    const P = (ang, q, y) => { const e = E(ang, q); return L(e.x, y, e.z); };
    addPolygon(B.setts, [P(a, .9, 0), P(b, .9, 0), P(b, 1.6, 0), P(a, 1.6, 0)], up);
    // Quay wall down to the water, then a Gothic arcaded balustrade on top.
    const inward = P(a, .8, 0).subtract(P(a, .9, 0)).normalize();
    addPolygon(B.ashlar, [P(a, .9, -2.5), P(b, .9, -2.5), P(b, .9, 0), P(a, .9, 0)], inward);
    addPolygon(B.ashlar, [P(a, .905, .95), P(b, .905, .95), P(b, .905, 1.12), P(a, .905, 1.12)], inward);
    addPolygon(B.ashlar, [P(a, .895, 1.12), P(b, .895, 1.12), P(b, .925, 1.12), P(a, .925, 1.12)], up);
    const mid = P((a + b) / 2, .91, 0), yaw = Math.atan2(inward.x, inward.z);
    if (k % 3 === 0) {
      addBox(B.ashlar, .42, 1.25, .42, mid.add(new V3(0, .62, 0)), yaw);
      addBox(B.carved, .5, .5, .5, mid.add(new V3(0, 1.42, 0)), yaw + Math.PI / 4);
    } else {
      // Small pointed arches between the posts, like the chronicle's balustrade.
      const F = frame(mid, yaw + Math.PI / 2);
      for (const dx of [-.28, .28]) addBox(B.ashlar, .09, .78, .12, F.at(dx, .44, 0), F.yaw);
      addPolygon(B.ashlar, archPts(F, 0, .22, .5, .72, .07).slice(2), F.out);
    }
  }
  const promenadeLine = [];
  for (let k = 0; k <= 40; k++) { const e = E(A0 - .25 + (A1 - A0 + .45) * k / 40, 1.02); promenadeLine.push(L(e.x, 0, e.z)); }

  // The Void: black, mirror-still water that holds every lantern.
  const water = track(BABYLON.MeshBuilder.CreateGround('The Void', { width: 140, height: 100 }, scene));
  water.position = L(8, -.8, 0);
  const voidMat = new BABYLON.StandardMaterial('The Void water', scene);
  voidMat.diffuseColor = rgb('#020305'); voidMat.specularColor = rgb('#5f7383'); voidMat.specularPower = 180;
  const mirror = new BABYLON.MirrorTexture('The Void reflection', 512, scene, true);
  mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, FLOOR - .8);
  mirror.level = .55;
  voidMat.reflectionTexture = mirror;
  water.material = voidMat;

  // Mist sheets drifting low over the water.
  const mistTex = new BABYLON.DynamicTexture('Void mist', { width: 256, height: 256 }, scene, true);
  (function paintMist() {
    const g = mistTex.getContext();
    g.clearRect(0, 0, 256, 256);
    for (let k = 0; k < 28; k++) {
      const x = 30 + hash(k * 3.1) * 196, y = 30 + hash(k * 7.7) * 196, r = 30 + hash(k * 1.9) * 60;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(255,255,255,.35)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    }
    mistTex.update();
  })();
  mistTex.hasAlpha = true;
  const mistMat = new BABYLON.StandardMaterial('Void mist', scene);
  mistMat.diffuseTexture = mistTex; mistMat.useAlphaFromDiffuseTexture = true; mistMat.opacityTexture = mistTex;
  mistMat.emissiveColor = rgb('#46525e'); mistMat.disableLighting = true; mistMat.backFaceCulling = false; mistMat.alpha = .3;
  const mists = [];
  for (let k = 0; k < 9; k++) {
    const m = track(BABYLON.MeshBuilder.CreateGround('Void mist sheet', { width: 34, height: 22 }, scene));
    m.position = L(-4 + hash(k * 4.4) * 40, -.5 + k * .09, -24 + hash(k * 2.2) * 48); m.material = mistMat;
    mists.push({ m, x: m.position.x, z: m.position.z, ph: k * 1.7 });
  }

  // ------------------------------------------------------ Gothic facades
  // Facades are carved into the west wall, facing across the promenade.
  const FQ = 1.24;
  function facadeAt(a) {
    const p = E(a, FQ), n = new V3(-p.x / (PRX * PRX), 0, -p.z / (PRZ * PRZ)).normalize();
    return frame(L(p.x, 0, p.z), Math.atan2(n.x, n.z));
  }
  function gothicFacade(F, w, h, seed) {
    const R = k => hash(seed * 9.1 + k * 2.3);
    addBox(B.carved, w, h, 2.2, F.at(0, h / 2, -1.1), F.yaw);
    addBox(B.ashlar, w + .4, .9, 2.6, F.at(0, .45, -.9), F.yaw);
    addBox(B.ashlar, w + .6, .45, .9, F.at(0, h - .2, .1), F.yaw);
    const bays = w > 11 ? 5 : 3, bw = w / bays;
    for (let b = 0; b <= bays; b++) {
      const x = -w / 2 + b * bw;
      addBox(B.ashlar, .6, h * .96, .85, F.at(x, h * .48, .3), F.yaw);
      const pin = track(BABYLON.MeshBuilder.CreateCylinder('Bellows pinnacle', { diameterTop: 0, diameterBottom: .75, height: 2.8 + R(b) * 1.4, tessellation: 4 }, scene));
      pin.position = F.at(x, h + 1.5, .3); pin.rotation.y = F.yaw + Math.PI / 4; pin.material = B.carved;
    }
    for (let b = 0; b < bays; b++) {
      const x = -w / 2 + (b + .5) * bw, centre = b === (bays - 1) / 2;
      if (centre) {
        gothicOpening(F, x, .9, 2.3, 4.2, .02, B.timber);
        for (let s = 0; s < 3; s++) addBox(B.ashlar, 3.6 - s * .4, .3, .5, F.at(x, .15 + s * .3, 1.35 - s * .45), F.yaw);
        for (const sx of [-1.7, 1.7]) {
          addBox(iron, .07, .07, .7, F.at(x + sx, 4.1, .35), F.yaw);
          lantern(F.at(x + sx, 3.75, .7), sx > 0 && R(b) > .3);
        }
      } else gothicOpening(F, x, 1.6, 1.25, 3, .02, R(b + 10) > .35 ? glow : dimGlass);
      for (let tier = 0; tier < (h > 15 ? 2 : 1); tier++) {
        const y0 = 6.6 + tier * 5.4;
        gothicOpening(F, x, y0, centre ? 1.6 : 1.1, centre ? 3.8 : 3.2, .02, R(b * 3 + tier) > .45 ? glow : dimGlass);
      }
    }
    // Balcony with a pierced balustrade across the middle bays.
    const bal = bw * (bays > 3 ? 2.6 : 1.4);
    addBox(B.ashlar, bal, .28, 1.3, F.at(0, 5.7, .75), F.yaw);
    for (let x = -bal / 2 + .2; x <= bal / 2 - .2; x += .38) addBox(B.carved, .08, .7, .08, F.at(x, 6.2, 1.3), F.yaw);
    addBox(B.ashlar, bal, .12, .18, F.at(0, 6.6, 1.3), F.yaw);
    // Either a steep traceried gable with a rose window, or a pinnacled parapet.
    if (R(40) > .4) {
      const gw = bw * 1.6;
      addPolygon(B.carved, [F.at(-gw / 2, h, .05), F.at(gw / 2, h, .05), F.at(0, h + gw * .9, .05)], F.out);
      const rose = track(BABYLON.MeshBuilder.CreateDisc('Bellows rose window', { radius: gw * .16, tessellation: 20, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene));
      rose.position = F.at(0, h + gw * .32, .1); rose.rotation.y = F.yaw + Math.PI; rose.material = glow;
    } else {
      for (let x = -w / 2 + .5; x <= w / 2 - .5; x += 1.1) addBox(B.ashlar, .55, .7, .6, F.at(x, h + .35, .1), F.yaw);
    }
  }
  const facadeSlots = [];
  for (let a = A0 - .22; a < A1 + .2;) {
    const w = 8.5 + hash(a * 13) * 6.5, step = (w + .6) / (FQ * 34);
    const mid = a + step / 2;
    if (Math.abs(mid - tunnelA) > .2) facadeSlots.push({ a: mid, w });
    a += step;
  }
  facadeSlots.forEach((slot, k) => gothicFacade(facadeAt(slot.a), slot.w, 13 + hash(k * 5.5) * 8, k + 1));

  // ------------------------------------------------------- Bellow's Lead
  const LEAD_START = -38, LEAD_END = -88;
  (function lead() {
    const shape = [];
    shape.push(new V3(-TUNNEL_HALF, 0, 0), new V3(-TUNNEL_HALF, 3.3, 0));
    for (let k = 1; k < 12; k++) { const t = Math.PI - k / 12 * Math.PI; shape.push(new V3(Math.cos(t) * TUNNEL_HALF, 3.3 + Math.sin(t) * 3.1, 0)); }
    shape.push(new V3(TUNNEL_HALF, 3.3, 0), new V3(TUNNEL_HALF, 0, 0));
    const vault = track(BABYLON.MeshBuilder.ExtrudeShape('Bellow\'s Lead vault', {
      shape, path: [L(TUNNEL_X, 0, LEAD_START + 2), L(TUNNEL_X, 0, LEAD_END - 3)], sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene));
    const vaultMat = stoneMat('Bellow\'s Lead rock', 'medieval_wall_02', '#8a8278', 1.1);
    vaultMat.backFaceCulling = false;
    for (const t of [vaultMat.albedoTexture, vaultMat.bumpTexture]) { t.uScale = 4; t.vScale = 22; }
    vault.material = vaultMat;
    addPolygon(B.setts, [L(TUNNEL_X - TUNNEL_HALF, .01, LEAD_END - 3), L(TUNNEL_X + TUNNEL_HALF, .01, LEAD_END - 3), L(TUNNEL_X + TUNNEL_HALF, .01, -26), L(TUNNEL_X - TUNNEL_HALF, .01, -26)], up);
    // Carved mouth framing the Lead where it meets the cavern.
    const mouthF = frame(L(TUNNEL_X, 0, LEAD_START + 1.2), 0);
    for (const sx of [-1, 1]) addBox(B.ashlar, 2.8, 10, 2.6, mouthF.at(sx * (TUNNEL_HALF + 1.4), 5, 0), 0);
    addBox(B.ashlar, TUNNEL_HALF * 2 + 5.6, 3.6, 2.6, mouthF.at(0, 8.2, 0), 0);
    // Carved shopfronts along both walls, lanterns kept low.
    const trades = ['a fence\'s counter', 'a moneylender', 'an alchemist', 'a tavern'];
    for (let z = LEAD_END + 6, k = 0; z < LEAD_START - 4; z += 8.5, k++) for (const side of [-1, 1]) {
      const F = frame(L(TUNNEL_X + side * (TUNNEL_HALF - .02), 0, z), side < 0 ? Math.PI / 2 : -Math.PI / 2);
      gothicOpening(F, 0, 0, 1.4, 2.6, 0, shadowMat);
      if (hash(k * 3 + side) > .35) gothicOpening(F, 1.9, 1.1, .7, 1.3, 0, glow);
      if ((k + (side > 0 ? 1 : 0)) % 2 === 0) lantern(F.at(-1.2, 2.3, .3), k % 2 === 0);
    }
    // Steps climbing back toward the surface at the far end.
    for (let s = 0; s < 10; s++) addBox(B.ashlar, TUNNEL_HALF * 2, .3 + s * .3, .45, L(TUNNEL_X, (.3 + s * .3) / 2, LEAD_END - 1 - s * .45), 0);
    lantern(L(TUNNEL_X - 2.3, 2.4, LEAD_END + 1), true);
    lantern(L(TUNNEL_X + 2.3, 2.4, LEAD_END + 1), false);
  })();

  // Lanterns along the promenade balustrade.
  for (let k = 0; k < 9; k++) {
    const e = E(A0 + (A1 - A0) * (k + .5) / 9, .93);
    addBox(iron, .1, 2.6, .1, L(e.x, 1.3, e.z), 0);
    lantern(L(e.x, 2.75, e.z), k % 2 === 0);
  }
  flush();

  // Warm light only on the Bellows itself; the surface lighting is untouched.
  // More than ~6 lights per material overflows the shader (with the city's
  // cascaded shadows compiled in) and Babylon silently falls back to an unlit
  // shader. So only four lanterns cast real light: one down the Lead and three
  // along the facades. The rest simply glow.
  const inLead = l => l.pos.z - origin.z < LEAD_START + 2 && Math.abs(l.pos.x - origin.x - TUNNEL_X) < 6;
  const spread = (list, n) => list.length <= n ? list : Array.from({ length: n }, (_, k) => list[Math.round((k + .5) * list.length / n - .5)]);
  const leadLamps = lanterns.filter(inLead).sort((a, b) => a.pos.z - b.pos.z);
  const caveLamps = lanterns.filter(l => !inLead(l)).sort((a, b) => Math.atan2(a.pos.z - origin.z, a.pos.x - origin.x) - Math.atan2(b.pos.z - origin.z, b.pos.x - origin.x));
  const lit = spread(leadLamps, 1).concat(spread(caveLamps, 3));
  const bellowsLights = lit.map((l, k) => {
    const light = new BABYLON.PointLight('Bellows lantern light ' + k, l.pos, scene);
    light.diffuse = rgb('#ffb257'); light.specular = rgb('#6b4a24'); light.intensity = 2.6; light.range = 38;
    light.includedOnlyMeshes = bellowsMeshes;
    return light;
  });
  const coolFill = new BABYLON.HemisphericLight('Bellows cavern fill', new V3(0, 1, 0), scene);
  coolFill.diffuse = rgb('#4f6385'); coolFill.groundColor = rgb('#0c1016'); coolFill.intensity = .75;
  coolFill.includedOnlyMeshes = bellowsMeshes;
  const glowLayer0 = W.glow;
  if (glowLayer0) bellowsMeshes.filter(m => m.material === lamp || m.material === glow).forEach(m => glowLayer0.addIncludedOnlyMesh(m));
  mirror.renderList = bellowsMeshes.filter(m => m !== water && !mists.some(x => x.m === m));

  // ------------------------------------------- townsfolk, carriage, cargo
  W.extraFolk = (W.extraFolk || []).concat(
    [0, 1, 2, 3, 4, 5].map(k => ({ line: promenadeLine, baseY: FLOOR, hooded: true, lane: (hash(k) - .5) * 3, speed: .8 + hash(k * 2) * .3 })),
    facadeSlots.filter((_, k) => k % 2 === 0).map((slot, k) => {
      const F = facadeAt(slot.a), p = F.at(hash(k) * 2 - 1, 0, 2.3);
      return { x: p.x, z: p.z, yaw: F.yaw + Math.PI + (hash(k * 3) - .5), baseY: FLOOR, hooded: true };
    }),
    [LEAD_END + 12, LEAD_END + 26].map((z, k) => ({ x: origin.x + TUNNEL_X + (k ? 1.8 : -1.8), z: origin.z + z, yaw: k ? -Math.PI / 2 : Math.PI / 2, baseY: FLOOR, hooded: true }))
  );
  {
    const e = E((A0 + A1) / 2 + .35, 1.02), t = E((A0 + A1) / 2 + .4, 1.02).subtract(e);
    W.extraCarts = (W.extraCarts || []).concat([{ x: origin.x + e.x, z: origin.z + e.z, yaw: Math.atan2(t.x, t.z), baseY: FLOOR }]);
  }
  W.extraProps = (W.extraProps || []).concat([0, 1, 2, 3, 4, 5].map(k => ({
    kind: ['barrel', 'crate', 'barrel', 'wine', 'crate', 'bucket'][k], x: origin.x + TUNNEL_X + (k % 2 ? 2.5 : -2.5), y: FLOOR, z: origin.z + LEAD_END + 8 + k * 6.5, yaw: k
  })));

  // --------------------------------------------------- walkable space
  function localOf(v) { return { x: v.x - origin.x, z: v.z - origin.z }; }
  function walkable(v) {
    const p = localOf(v);
    if (Math.abs(p.x - TUNNEL_X) < TUNNEL_HALF - .5 && p.z < -24 && p.z > LEAD_END - 3) return true;
    const q = Math.hypot(p.x / PRX, p.z / PRZ);
    let a = Math.atan2(p.z / PRZ, p.x / PRX); if (a < 0) a += Math.PI * 2;
    return q > .945 && q < 1.19 && a > A0 - .32 && a < A1 + .3;
  }

  // --------------------------------------------- the surface entrance
  const portal = (function placePortal() {
    const road = W.roadLines.find(r => r.road.name === 'South Loop');
    for (let i = 0; i < 14; i++) for (const side of [-1, 1]) {
      const a = road.line[i], b = road.line[i + 1], t = b.subtract(a).normalize(), n = new V3(t.z, 0, -t.x).scale(side);
      const c = a.add(n.scale(road.road.width / 2 + 6.2)), yaw = Math.atan2(-n.x, -n.z);
      const F = frame(c, yaw), clear = [[0, 0], [-4.8, -2.5], [4.8, -2.5], [-4.8, 2.5], [4.8, 2.5]].every(([x, z]) => {
        const p = F.at(x, 0, z);
        return !collisions.some(k => hitsCollider(k, p.x, p.z, .3)) && roadClearance(p.x, p.z) > .4;
      });
      if (clear) return F;
    }
    return frame(map(14.5, 41.5), 0);
  })();
  (function buildPortal() {
    const F = portal, s = mats;
    const parts = [];
    const bx = (name, w, h, d, x, y, z, mat) => { const m = BABYLON.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene); m.position = F.at(x, y, z); m.rotation.y = F.yaw; m.material = mat; parts.push(m); return m; };
    bx('Bellow\'s Lead gatehouse', 10, 7.5, 5, 0, 3.75, -2.5, s.stoneDark);
    bx('Bellow\'s Lead cornice', 10.6, .5, 5.6, 0, 7.6, -2.5, s.stone);
    for (let x = -4.6; x <= 4.7; x += 1.3) bx('Bellow\'s Lead merlon', .7, .8, 5.2, x, 8.2, -2.5, s.stone);
    for (const sx of [-1, 1]) bx('Bellow\'s Lead buttress', 1, 7.2, 1.1, sx * 4.6, 3.6, .3, s.stone);
    // Pointed-arch opening: a dressed stone surround around a black stairway.
    const fan = (name, pts, mat) => {
      const m = new BABYLON.Mesh(name, scene), d = new BABYLON.VertexData(), p = [], idx = [], uv = [];
      pts.forEach(v => { p.push(v.x, v.y, v.z); uv.push((v.x + v.z) / 2, v.y / 2); });
      for (let k = 1; k < pts.length - 1; k++) idx.push(0, k + 1, k);
      d.positions = p; d.indices = idx; d.uvs = uv; d.normals = []; BABYLON.VertexData.ComputeNormals(p, idx, d.normals); d.applyToMesh(m);
      m.material = mat; parts.push(m); return m;
    };
    fan('Bellow\'s Lead arch surround', archPts(F, 0, 0, 4.9, 6, .04), s.stone);
    fan('Bellow\'s Lead dark stairway', archPts(F, 0, 0, 3.9, 5.3, .08), shadowMat);
    for (const sx of [-1, 1]) {
      const l = BABYLON.MeshBuilder.CreateBox('Bellow\'s Lead lantern', { width: .32, height: .5, depth: .32 }, scene);
      l.position = F.at(sx * 2.8, 3.3, .45); l.material = lamp; parts.push(l);
    }
    const sign = new BABYLON.DynamicTexture('Bellow\'s Lead sign paint', { width: 1024, height: 160 }, scene, true), g = sign.getContext();
    g.fillStyle = '#2a2521'; g.fillRect(0, 0, 1024, 160); g.strokeStyle = '#8d8577'; g.lineWidth = 12; g.strokeRect(8, 8, 1008, 144);
    g.fillStyle = '#cfc4b0'; g.font = 'bold 84px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('BELLOW\'S LEAD', 512, 84); sign.update();
    const signMat = new BABYLON.StandardMaterial('Bellow\'s Lead sign', scene); signMat.diffuseTexture = sign; signMat.emissiveColor = rgb('#1c1a17');
    const board = BABYLON.MeshBuilder.CreatePlane('Bellow\'s Lead carved name', { width: 5.4, height: .84 }, scene);
    board.position = F.at(0, 6.55, .05); board.rotation.y = F.yaw + Math.PI; board.material = signMat; parts.push(board);
    parts.forEach(m => { m.isPickable = false; m.receiveShadows = true; shadows.addShadowCaster(m, false); });
    const c = F.at(0, 0, -2.5);
    collisions.push({ x: c.x, z: c.z, hw: 5, hd: 2.5, yaw: F.yaw, kind: 'portal' });
  })();
  const portalDoor = portal.at(0, 0, .9);

  // ------------------------------------------------------- transitions
  const veil = document.createElement('div');
  veil.style.cssText = 'position:absolute;inset:0;z-index:7;background:#000;opacity:0;pointer-events:none;transition:opacity .45s ease;display:flex;align-items:center;justify-content:center;font:28px Cinzel,Georgia,serif;letter-spacing:.14em;color:#d8c9a4;text-shadow:0 2px 14px #000';
  document.body.appendChild(veil);
  const sun = scene.getLightByName('late afternoon'), sky = scene.getLightByName('open sky'), beacon = scene.getLightByName('Beacon flame');
  const glowLayer = scene.effectLayers && scene.effectLayers.find(l => l.name === 'lantern glow');
  let saved = null, busy = false;
  const setBellowsVisible = on => bellowsMeshes.forEach(m => m.setEnabled(on));
  const surfaceStatic = () => (W.cityMeshes || []).concat(W.decor || [], W.kitMeshes || [], scene.meshes.filter(m => /sky|Dibaryn|original map/.test(m.name)));
  setBellowsVisible(false);
  bellowsLights.forEach(l => l.setEnabled(false)); coolFill.setEnabled(false);

  const zone = {
    district: 'The Bellows',
    note: 'Beneath the High District · the Watch does not come here',
    place() { const p = localOf(camera.position); return p.z < -30 && Math.abs(p.x - TUNNEL_X) < 5 ? 'Bellow\'s Lead' : 'The Void promenade'; },
    blocked: v => !walkable(v),
    height: () => FLOOR + W.EYE_HEIGHT,
    leave(instant) { exitBellows(instant); }
  };
  function fade(title, then) {
    busy = true; veil.textContent = title || ''; veil.style.opacity = '1';
    setTimeout(() => { then(); setTimeout(() => { veil.style.opacity = '0'; setTimeout(() => { busy = false; }, 500); }, title ? 900 : 150); }, 460);
  }
  function enterBellows() {
    fade('THE BELLOWS', () => {
      saved = { fog: scene.fogDensity, fogColor: scene.fogColor.clone(), clear: scene.clearColor.clone(), glow: glowLayer && glowLayer.intensity };
      surfaceStatic().forEach(m => m.setEnabled(false));
      if (sun) sun.setEnabled(false); if (sky) sky.intensity = .05; if (beacon) beacon.setEnabled(false);
      setBellowsVisible(true); bellowsLights.forEach(l => l.setEnabled(true)); coolFill.setEnabled(true);
      scene.fogDensity = .014; scene.fogColor = rgb('#06080b'); scene.clearColor = new BABYLON.Color4(.01, .012, .016, 1);
      if (glowLayer) glowLayer.intensity = .45;
      W.zone = zone;
      camera.position = L(TUNNEL_X, W.EYE_HEIGHT, LEAD_END + 3);
      camera.rotation.set(0, 0, 0);
    });
  }
  function exitBellows(instant) {
    if (!W.zone) return;
    const restore = () => {
      W.zone = null;
      surfaceStatic().forEach(m => m.setEnabled(true));
      if (sun) sun.setEnabled(true); if (sky) sky.intensity = .5; if (beacon) beacon.setEnabled(true);
      setBellowsVisible(false); bellowsLights.forEach(l => l.setEnabled(false)); coolFill.setEnabled(false);
      scene.fogDensity = saved.fog; scene.fogColor = saved.fogColor; scene.clearColor = saved.clear;
      if (glowLayer) glowLayer.intensity = saved.glow;
      const out = portal.at(0, W.EYE_HEIGHT, 3.2);
      camera.position = out; camera.rotation.set(0, portal.yaw, 0);
    };
    if (instant) restore(); else fade('', restore);
  }
  scene.onBeforeRenderObservable.add(() => {
    const t = performance.now() / 1000;
    if (W.zone) mists.forEach(({ m, x, z, ph }) => { m.position.x = x + Math.sin(t * .05 + ph) * 6; m.position.z = z + Math.cos(t * .04 + ph) * 4; });
    if (busy || W.isAerial()) return;
    if (!W.zone) {
      if (Math.hypot(camera.position.x - portalDoor.x, camera.position.z - portalDoor.z) < 1.7) enterBellows();
    } else if (camera.position.z - origin.z < LEAD_END + .6) exitBellows(false);
  });
  W.bellows = { enter: enterBellows, exit: exitBellows, portal, origin, FLOOR };
  }
})();
