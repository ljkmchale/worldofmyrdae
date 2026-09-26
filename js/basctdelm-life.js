/* Street life for the walkable Basctdelm: scanned props, hand carts and
 * townsfolk. Everything is drawn with thin instances (one draw call per part
 * type), so hundreds of barrels and people stay cheap.
 */
(function () {
  'use strict';
  const W = window.BasctdelmWalk;
  if (!W || !window.BABYLON) return;
  const { scene, shadows, collisions, hitsCollider, roadLines, roadClearance, hash, mats, pct } = W;
  const V3 = BABYLON.Vector3, M = BABYLON.Matrix, Q = BABYLON.Quaternion;
  const rgb = hex => BABYLON.Color3.FromHexString(hex);
  const pick = (list, r) => list[Math.floor(r * list.length) % list.length];
  let seedCounter = 1;
  const rnd = () => hash(seedCounter++ * 1.618);

  function prepare(mesh) {
    mesh.isPickable = false;
    mesh.receiveShadows = true;
    mesh.alwaysSelectAsActiveMesh = true;
    shadows.addShadowCaster(mesh, false);
    return mesh;
  }
  function freeAt(x, z, radius) {
    if (roadClearance(x, z) < radius) return false;
    const q = pct({ x, z });
    if (q.x < 0 || q.x > 100 || q.y < 0 || q.y > 100) return false;
    return !collisions.some(c => hitsCollider(c, x, z, radius));
  }
  function occupy(x, z, hw, hd, yaw, kind) { collisions.push({ x, z, hw, hd, yaw, kind }); }
  const place = (x, y, z, yaw, s = 1) =>
    M.Compose(new V3(s, s, s), Q.RotationYawPitchRoll(yaw, 0, 0), new V3(x, y, z));

  // ---------------------------------------------------------------- carts
  const iron = new BABYLON.StandardMaterial('cart ironwork', scene);
  iron.diffuseColor = rgb('#2c2c2c'); iron.specularColor = rgb('#303030');
  const WHEEL_Y = .55, WHEEL_X = .76, WHEEL_Z = -.1, WHEEL_R = .54;
  function merged(parts, name) {
    const mesh = BABYLON.Mesh.MergeMeshes(parts, true, true, undefined, false, true);
    mesh.name = name;
    return prepare(mesh);
  }
  const box = (w, h, d) => BABYLON.MeshBuilder.CreateBox('cart part', { width: w, height: h, depth: d }, scene);
  function part(parts, mesh, mat, x, y, z, rx = 0, rz = 0) {
    mesh.position.set(x, y, z); mesh.rotation.x = rx; mesh.rotation.z = rz; mesh.material = mat; parts.push(mesh);
  }
  // One wheel centred on its hub, axle along x, so it can spin in place.
  function wheelParts(parts, x, y, z) {
    const rim = BABYLON.MeshBuilder.CreateTorus('cart wheel rim', { diameter: WHEEL_R * 2, thickness: .08, tessellation: 24 }, scene);
    part(parts, rim, iron, x, y, z, 0, Math.PI / 2);
    for (let k = 0; k < 4; k++) part(parts, box(.05, WHEEL_R * 1.9, .05), mats.timber, x, y, z, k * Math.PI / 4);
    const hub = BABYLON.MeshBuilder.CreateCylinder('cart hub', { diameter: .2, height: .22, tessellation: 10 }, scene);
    part(parts, hub, mats.timber, x, y, z, 0, Math.PI / 2);
  }
  // Hand carts have shafts sloping to the cobbles; horse carts carry them
  // level at the horse's flanks, reaching forward past its shoulders.
  function buildCart(horse, wheels, name) {
    const parts = [];
    part(parts, box(1.3, .1, 2), mats.wood, 0, .78, 0);
    for (const s of [-1, 1]) {
      part(parts, box(.06, .36, 2), mats.wood, s * .62, 1.0, 0);
      part(parts, box(1.3, .36, .06), mats.wood, 0, 1.0, s * .98);
      if (horse) part(parts, box(.08, .08, 3.4), mats.timber, s * .5, .95, 2.6);
      else part(parts, box(.07, .07, 2.3), mats.timber, s * .45, .55, 2.0, .2);
      if (wheels) wheelParts(parts, s * WHEEL_X, WHEEL_Y, WHEEL_Z);
    }
    const axle = BABYLON.MeshBuilder.CreateCylinder('cart axle', { diameter: .08, height: 1.6, tessellation: 8 }, scene);
    part(parts, axle, iron, 0, WHEEL_Y, WHEEL_Z, 0, Math.PI / 2);
    return merged(parts, name);
  }
  function buildWheel() {
    const parts = [];
    wheelParts(parts, 0, 0, 0);
    return merged(parts, 'rolling cart wheels');
  }

  // --------------------------------------------------------------- horses
  // Horses are thin-instanced parts like the townsfolk: rigid body, neck,
  // head and collar, with four legs and a tail animated per horse.
  const coats = ['#5c3520', '#7a4424', '#8d8a84', '#2a2420', '#a8845a', '#4a2c1c', '#b8b2a6'];
  function horsePart(name, mesh, bake) {
    if (bake) mesh.bakeTransformIntoVertices(bake);
    const mat = new BABYLON.StandardMaterial('horse ' + name, scene);
    mat.diffuseColor = new BABYLON.Color3(.9, .9, .9); mat.specularColor = rgb('#1c1c1c');
    mesh.material = mat; mesh.name = 'horse ' + name;
    mesh.thinInstanceRegisterAttribute('color', 4);
    return prepare(mesh);
  }
  const RX = a => M.RotationX(a);
  const H = {
    body: horsePart('body', BABYLON.MeshBuilder.CreateCapsule('b', { radius: .34, height: 1.75, tessellation: 12 }, scene), RX(Math.PI / 2)),
    neck: horsePart('neck', BABYLON.MeshBuilder.CreateCapsule('n', { radius: .18, height: 1.0, tessellation: 10 }, scene), M.Translation(0, .4, 0).multiply(RX(.72))),
    head: horsePart('head', BABYLON.MeshBuilder.CreateCapsule('h', { radius: .12, height: .66, tessellation: 10 }, scene), M.Translation(0, -.26, 0).multiply(RX(-1.05))),
    // Shoulder and hindquarter masses give the barrel body a horse silhouette.
    quarters: horsePart('quarters', BABYLON.MeshBuilder.CreateSphere('q', { diameter: .86, segments: 12 }, scene), M.Scaling(.92, 1, 1.05)),
    thigh: horsePart('upper legs', BABYLON.MeshBuilder.CreateCapsule('u', { radius: .115, height: .55, tessellation: 8 }, scene), M.Translation(0, -.22, 0)),
    mane: horsePart('mane', BABYLON.MeshBuilder.CreateBox('m', { width: .07, height: .16, depth: .95 }, scene)),
    ear: horsePart('ears', BABYLON.MeshBuilder.CreateCylinder('e', { diameterTop: 0, diameterBottom: .07, height: .14, tessellation: 5 }, scene)),
    collar: horsePart('collar', BABYLON.MeshBuilder.CreateTorus('c', { diameter: .52, thickness: .12, tessellation: 16 }, scene), RX(1.25)),
    leg: horsePart('lower legs', BABYLON.MeshBuilder.CreateCapsule('l', { radius: .055, height: .58, tessellation: 8 }, scene), M.Translation(0, -.26, 0)),
    muzzle: horsePart('muzzle', BABYLON.MeshBuilder.CreateSphere('z', { diameter: .2, segments: 10 }, scene), M.Scaling(.8, .8, 1.25)),
    hoof: horsePart('hooves', BABYLON.MeshBuilder.CreateCylinder('f', { diameterTop: .12, diameterBottom: .15, height: .1, tessellation: 8 }, scene)),
    tail: horsePart('tail', BABYLON.MeshBuilder.CreateCapsule('t', { radius: .07, height: .75, tessellation: 8 }, scene), M.Translation(0, -.36, 0))
  };
  const horses = [];
  function addHorse(moving) {
    const coat = rgb(pick(coats, rnd())), dark = coat.scale(.45), leather = rgb('#2d2016');
    const color = c => [c.r, c.g, c.b, 1];
    const slot = (name, c) => {
      const i = H[name].thinInstanceAdd(M.Identity(), false);
      H[name].thinInstanceSetAttributeAt('color', i, color(c), false);
      return i;
    };
    const h = { moving, phase: rnd() * 6.28, root: M.Identity(), slots: {
      body: slot('body', coat), neck: slot('neck', coat), head: slot('head', coat), collar: slot('collar', leather),
      muzzle: slot('muzzle', coat.scale(.7)), ears: [slot('ear', coat), slot('ear', coat)], tail: slot('tail', dark), mane: slot('mane', dark),
      quarters: [slot('quarters', coat), slot('quarters', coat)], thighs: [0, 1, 2, 3].map(() => slot('thigh', coat)),
      legs: [0, 1, 2, 3].map(() => slot('leg', coat)), hooves: [0, 1, 2, 3].map(() => slot('hoof', rgb('#1b1612')))
    } };
    horses.push(h);
    return h;
  }
  const hBuf = {};
  const hm = { root: new M(), a: new M(), b: new M(), c: new M() };
  function hWrite(name, i, local) { local.multiplyToRef(hm.root, hm.c); hm.c.copyToArray(hBuf[name], i * 16); }
  // Walk: each leg a quarter cycle apart (left fore, right fore, left hind, right hind offsets).
  const LEGS = [[-.2, .62, .25], [.2, .62, .75], [-.2, -.62, 0], [.2, -.62, .5]];
  function poseHorse(h) {
    hm.root.copyFrom(h.root);
    const nod = h.moving ? Math.sin(h.phase * 2) * .04 : Math.sin(h.phase * .7) * .025;
    M.TranslationToRef(0, 1.22, 0, hm.a); hWrite('body', h.slots.body, hm.a);
    M.TranslationToRef(0, 1.34, .78, hm.a); hWrite('neck', h.slots.neck, hm.a);
    M.TranslationToRef(0, 1.3, .55, hm.a); hWrite('quarters', h.slots.quarters[0], hm.a);
    M.TranslationToRef(0, 1.3, -.6, hm.a); hWrite('quarters', h.slots.quarters[1], hm.a);
    M.RotationXToRef(-.85, hm.b); M.TranslationToRef(0, 1.84, .96, hm.c); hm.b.multiplyToRef(hm.c, hm.a); hWrite('mane', h.slots.mane, hm.a);
    M.TranslationToRef(0, 1.5, .76, hm.a); hWrite('collar', h.slots.collar, hm.a);
    M.TranslationToRef(0, 2.1 + nod, 1.26, hm.a); hWrite('head', h.slots.head, hm.a);
    M.TranslationToRef(0, 1.82 + nod, 1.72, hm.a); hWrite('muzzle', h.slots.muzzle, hm.a);
    for (const s of [0, 1]) { M.TranslationToRef(s ? .07 : -.07, 2.2 + nod, 1.18, hm.a); hWrite('ear', h.slots.ears[s], hm.a); }
    const tail = new M();
    M.RotationZToRef(Math.sin(h.phase * .8) * .18, hm.a); M.RotationXToRef(.45, hm.b); hm.a.multiplyToRef(hm.b, tail);
    M.TranslationToRef(0, 1.42, -1.02, hm.b); tail.multiplyToRef(hm.b, hm.a); hWrite('tail', h.slots.tail, hm.a);
    LEGS.forEach(([x, z, offset], k) => {
      // The upper leg swings; the knee (or hock) folds as the hoof lifts forward.
      const cycle = h.phase + offset * Math.PI * 2;
      const swing = h.moving ? -Math.sin(cycle) * .3 : 0;
      const fold = h.moving ? .75 * Math.max(0, Math.cos(cycle)) ** 1.5 : 0;
      const upper = new M(), lower = new M();
      M.RotationXToRef(swing, hm.a); M.TranslationToRef(x, 1.06, z, hm.b); hm.a.multiplyToRef(hm.b, upper);
      hWrite('thigh', h.slots.thighs[k], upper);
      M.RotationXToRef(fold, hm.a); M.TranslationToRef(0, -.5, 0, hm.b); hm.a.multiplyToRef(hm.b, hm.c); hm.c.multiplyToRef(upper, lower);
      hWrite('leg', h.slots.legs[k], lower);
      M.TranslationToRef(0, -.52, 0, hm.a); hm.a.multiplyToRef(lower, hm.b); hWrite('hoof', h.slots.hooves[k], hm.b);
    });
  }

  // ------------------------------------------------- parked and moving carts
  const carts = [];
  function parkCarts() {
    const handCart = buildCart(false, true, 'hand carts');
    const horseCart = buildCart(true, true, 'parked horse carts');
    roadLines.forEach(({ road, line, bridge }, ri) => {
      if (bridge) return;
      for (let i = 2; i < line.length - 2; i += 3) {
        if (hash(ri * 131 + i) > .34) continue;
        const a = line[i], b = line[i + 1], t = b.subtract(a).normalize();
        const side = hash(ri * 17 + i) > .5 ? 1 : -1;
        const across = new V3(t.z, 0, -t.x).scale(side * (road.width / 2 + .95));
        const c = a.add(across), dir = hash(ri + i * 7) > .5 ? 1 : -1;
        const yaw = Math.atan2(t.x * dir, t.z * dir);
        const fx = Math.sin(yaw), fz = Math.cos(yaw);
        const clear = probes => probes.every(([u, v]) => {
          const x = c.x + u * fz + v * fx, z = c.z - u * fx + v * fz;
          return !collisions.some(k => hitsCollider(k, x, z, .15)) && roadClearance(x, z) > -.1;
        });
        // The bed, wheels and shaft tips (and a horse, if one fits) must sit on clear ground.
        if (!clear([[0, 0], [0, 1.6], [0, -1.1], [.8, 0], [-.8, 0]])) continue;
        const withHorse = hash(ri * 3 + i * 5) > .55 && clear([[0, 2.8], [0, 4.3], [.45, 3.6], [-.45, 3.6]]);
        (withHorse ? horseCart : handCart).thinInstanceAdd(place(c.x, 0, c.z, yaw));
        if (withHorse) addHorse(false).root = place(c.x + fx * 2.75, 0, c.z + fz * 2.75, yaw);
        const reach = withHorse ? 1.6 : .6;
        occupy(c.x + fx * reach, c.z + fz * reach, .8, withHorse ? 3.1 : 1.9, yaw, 'cart');
        carts.push({ x: c.x, z: c.z, yaw, loaded: hash(ri * 5 + i) > .45 });
      }
    });
    (W.extraCarts || []).forEach(e => {
      horseCart.thinInstanceAdd(place(e.x, e.baseY || 0, e.z, e.yaw));
      addHorse(false).root = place(e.x + Math.sin(e.yaw) * 2.75, e.baseY || 0, e.z + Math.cos(e.yaw) * 2.75, e.yaw);
    });
  }
  // Horse carts travelling the wider streets, keeping to their side and
  // turning back at the ends of the road; a carter walks at the horse's head.
  const travellers = [];
  const rolling = {};
  function driveCarts() {
    rolling.body = buildCart(true, false, 'travelling horse carts');
    rolling.wheel = buildWheel();
    roadLines.forEach(({ road, line, bridge }, ri) => {
      if (bridge || road.width < 4.1) return;
      const lengths = [0];
      for (let i = 1; i < line.length; i++) lengths.push(lengths[i - 1] + V3.Distance(line[i - 1], line[i]));
      const total = lengths[lengths.length - 1];
      for (let k = 0; k < Math.max(1, Math.round(total / 75)); k++) {
        const c = { line, lengths, total, width: road.width, s: 6 + hash(ri * 13 + k) * (total - 12),
          dir: hash(ri + k * 9) > .5 ? 1 : -1, speed: 1.35 + hash(ri * 7 + k) * .35, v: 0, yaw: null, spin: 0,
          horse: addHorse(true), loaded: hash(ri * 11 + k) > .4, x: 0, z: 0 };
        c.carter = person(0, 0, 0, true);
        c.carter.follow = c;
        travellers.push(c);
      }
    });
    rolling.bodyData = new Float32Array(travellers.length * 16);
    rolling.wheelData = new Float32Array(travellers.length * 32);
    rolling.body.thinInstanceSetBuffer('matrix', rolling.bodyData, 16, false);
    rolling.wheel.thinInstanceSetBuffer('matrix', rolling.wheelData, 16, false);
  }
  function roadPoint(c, s) {
    let i = 1; while (i < c.line.length - 1 && c.lengths[i] < s) i++;
    const a = c.line[i - 1], b = c.line[i], f = (s - c.lengths[i - 1]) / (c.lengths[i] - c.lengths[i - 1] || 1);
    const tx = b.x - a.x, tz = b.z - a.z, len = Math.hypot(tx, tz) || 1;
    return { x: a.x + tx * f, z: a.z + tz * f, tx: tx / len, tz: tz / len };
  }
  const cm = { root: new M(), a: new M(), b: new M(), c: new M() };
  function moveCarts(dt) {
    travellers.forEach((c, n) => {
      const want = c.yaw === null || cartClear(c) ? c.speed : 0;
      c.v += (want - c.v) * Math.min(1, dt * 2.5);
      c.s += c.dir * c.v * dt;
      if (c.s < 4 || c.s > c.total - 4) { c.dir *= -1; c.s = Math.max(4, Math.min(c.total - 4, c.s)); }
      const p = roadPoint(c, c.s), lane = c.width * .24;
      c.x = p.x + p.tz * lane * c.dir; c.z = p.z - p.tx * lane * c.dir;
      const target = Math.atan2(p.tx * c.dir, p.tz * c.dir);
      if (c.yaw === null) c.yaw = target;
      let turn = target - c.yaw; turn = Math.atan2(Math.sin(turn), Math.cos(turn));
      c.yaw += turn * Math.min(1, dt * 2.5);
      c.spin -= c.v * dt / WHEEL_R;
      M.ComposeToRef(new V3(1, 1, 1), Q.RotationYawPitchRoll(c.yaw, 0, 0), new V3(c.x, 0, c.z), cm.root);
      cm.root.copyToArray(rolling.bodyData, n * 16);
      for (const s of [0, 1]) {
        M.RotationXToRef(c.spin, cm.a); M.TranslationToRef((s ? 1 : -1) * WHEEL_X, WHEEL_Y, WHEEL_Z, cm.b);
        cm.a.multiplyToRef(cm.b, cm.c); cm.c.multiplyToRef(cm.root, cm.a); cm.a.copyToArray(rolling.wheelData, (n * 2 + s) * 16);
      }
      M.TranslationToRef(0, 0, 2.75, cm.a); cm.a.multiplyToRef(cm.root, c.horse.root);
      c.horse.moving = c.v > .05;
      c.horse.phase += dt * (c.horse.moving ? c.v / 1.7 * Math.PI * 2 : 1);
    });
  }

  // ---------------------------------------------------------------- props
  const MODEL_DIR = 'images/city-scenes/basctdelm/models/';
  async function loadProp(asset) {
    const importer = BABYLON.SceneLoader && BABYLON.SceneLoader.ImportMeshAsync
      ? BABYLON.SceneLoader.ImportMeshAsync('', MODEL_DIR + asset + '/', asset + '.gltf', scene)
      : BABYLON.ImportMeshAsync(MODEL_DIR + asset + '/' + asset + '.gltf', scene);
    const result = await importer;
    const pieces = result.meshes.filter(m => m.getTotalVertices() > 0);
    pieces.forEach(m => { m.computeWorldMatrix(true); m.setParent(null); m.bakeCurrentTransformIntoVertices(); });
    result.meshes.filter(m => !pieces.includes(m)).forEach(m => m.dispose());
    const mesh = pieces.length > 1 ? BABYLON.Mesh.MergeMeshes(pieces, true, true, undefined, false, true) : pieces[0];
    mesh.name = asset + ' props';
    mesh.refreshBoundingInfo();
    const box = mesh.getBoundingInfo().boundingBox;
    mesh.isVisible = true;
    return { mesh: prepare(mesh), base: box.minimum.y, height: box.maximum.y - box.minimum.y,
      radius: Math.max(box.maximum.x - box.minimum.x, box.maximum.z - box.minimum.z) / 2 };
  }
  function spread(props) {
    const put = (prop, x, y, z, yaw, collide = true) => {
      prop.mesh.thinInstanceAdd(place(x, y - prop.base, z, yaw));
      if (collide) occupy(x, z, prop.radius, prop.radius, yaw, 'prop');
    };
    const { barrel, wine, crate, bucket, basket } = props;
    // Against house fronts: barrels by doors, crate stacks, baskets and buckets.
    collisions.filter(c => c.kind === 'house').forEach((house, h) => {
      if (hash(h * 3.3) > .3) return;
      const fx = Math.sin(house.yaw), fz = Math.cos(house.yaw);
      const rx = Math.cos(house.yaw), rz = -Math.sin(house.yaw);
      const kind = Math.floor(hash(h * 5.1) * 4);
      const group = kind === 0 ? [barrel, barrel, bucket] : kind === 1 ? [crate, crate, basket]
        : kind === 2 ? [wine, barrel] : [basket, bucket, crate];
      let u = (hash(h * 7.7) - .5) * Math.max(0, house.hw * 2 - 2.4);
      for (const prop of group) {
        const out = house.hd + prop.radius + .06;
        const x = house.x + fx * out + rx * u, z = house.z + fz * out + rz * u;
        if (freeAt(x, z, prop.radius * .9)) {
          put(prop, x, 0, z, house.yaw + (hash(h + u) - .5) * .8);
          if (prop === crate && hash(h * 9.1) > .5) put(crate, x, crate.height, z, house.yaw + .3, false);
        }
        u += prop.radius * 2 + .12;
      }
    });
    (W.extraProps || []).forEach(e => { const prop = props[e.kind]; if (prop) put(prop, e.x, e.y || 0, e.z, e.yaw || 0, false); });
    // Beside every market stall.
    W.stalls.forEach((s, i) => {
      for (const [dx, dz, prop] of [[1.95, .4, basket], [1.95, -.5, crate], [-1.95, .2, barrel]]) {
        if (hash(i * 3 + dx) > .7) continue;
        if (freeAt(s.x + dx, s.z + dz, prop.radius * .8)) put(prop, s.x + dx, 0, s.z + dz, hash(i + dz) * 3);
      }
    });
    // Cargo waiting on the Trade District piers.
    W.docks.forEach((d, i) => {
      const a = W.map(d[0][0], d[0][1]), b = W.map(d[1][0], d[1][1]);
      const yaw = Math.atan2(b.x - a.x, b.z - a.z);
      for (let k = 0; k < 4; k++) {
        const p = V3.Lerp(a, b, .18 + k * .2), side = (k % 2 ? 1 : -1) * .55;
        const prop = pick([barrel, crate, barrel, wine], hash(i * 11 + k));
        put(prop, p.x + Math.cos(yaw) * side, .65, p.z - Math.sin(yaw) * side, yaw + k, false);
      }
    });
    // Loaded carts carry barrels or crates on the bed.
    carts.filter(c => c.loaded).forEach((c, i) => {
      const prop = hash(i * 2.2) > .5 ? barrel : crate;
      for (const along of [-.45, .45]) {
        put(prop, c.x + Math.sin(c.yaw) * along, .83, c.z + Math.cos(c.yaw) * along, c.yaw + i, false);
      }
    });
  }
  function loadProps() {
    const names = { barrel: 'Barrel_01', wine: 'wine_barrel_01', crate: 'wooden_crate_01', bucket: 'wooden_bucket_01', basket: 'wicker_basket_01' };
    Promise.all(Object.entries(names).map(([key, asset]) => loadProp(asset).then(p => [key, p])))
      .then(entries => spread(Object.fromEntries(entries)))
      .catch(error => console.warn('Basctdelm props could not load:', error));
  }

  // ------------------------------------------------------------- townsfolk
  // Each person is ~20 thin-instanced parts on a small skeleton: hips and
  // knees, shoulders and elbows, and a neck that lets the head turn.
  const cloth = ['#6b4a32', '#7a6a4a', '#4b5a3a', '#5e3b36', '#3f4a5a', '#8a7a5a', '#6a6a62', '#8c5a3a', '#4a3a52', '#a89878', '#7d3b2e', '#2f3d33', '#55493c'];
  const skin = ['#e3bb9c', '#c9976f', '#a36f4c', '#7a4e33', '#efc9ab', '#d7a886'];
  const hair = ['#2b2018', '#4a3322', '#7a5a38', '#1c1a18', '#8a8070', '#5b3a20'];
  const hose = ['#2e2a26', '#3b3228', '#403a33', '#2c3330', '#4a3a2c', '#5a4a38'];
  const linen = ['#d9d0bd', '#cfc6b0', '#e4dccb'];
  function partMesh(name, mesh, bake) {
    if (bake) mesh.bakeTransformIntoVertices(bake);
    const mat = new BABYLON.StandardMaterial(name + ' material', scene);
    mat.diffuseColor = new BABYLON.Color3(.95, .95, .95); mat.specularColor = rgb('#0d0d0d');
    mesh.material = mat; mesh.name = 'townsfolk ' + name;
    mesh.thinInstanceRegisterAttribute('color', 4);
    return prepare(mesh);
  }
  const MB = BABYLON.MeshBuilder, down = d => M.Translation(0, -d, 0);
  const P = {
    torso: partMesh('torso', MB.CreateCylinder('t', { height: .5, diameterTop: .36, diameterBottom: .3, tessellation: 12 }, scene), M.Translation(0, .25, 0)),
    shoulders: partMesh('shoulders', MB.CreateSphere('s', { diameter: .44, segments: 10 }, scene), M.Scaling(1, .42, .6)),
    neck: partMesh('neck', MB.CreateCylinder('k', { diameter: .1, height: .14, tessellation: 8 }, scene)),
    head: partMesh('head', MB.CreateSphere('h', { diameter: .2, segments: 12 }, scene), M.Scaling(.92, 1.12, 1)),
    nose: partMesh('nose', MB.CreateSphere('o', { diameter: .05, segments: 6 }, scene), M.Scaling(.75, 1, 1.4)),
    hair: partMesh('hair and coifs', MB.CreateSphere('c', { diameter: .215, segments: 10, slice: .62 }, scene)),
    hood: partMesh('hoods', MB.CreateSphere('d', { diameter: .26, segments: 10, slice: .78 }, scene), M.Scaling(1, 1.05, 1.08)),
    cowl: partMesh('cowls', MB.CreateTorus('w', { diameter: .27, thickness: .09, tessellation: 14 }, scene)),
    brim: partMesh('hat brims', MB.CreateCylinder('b', { diameter: .4, height: .02, tessellation: 16 }, scene)),
    crown: partMesh('hat crowns', MB.CreateSphere('r', { diameter: .23, segments: 10, slice: .5 }, scene), M.Scaling(1, .75, 1)),
    belt: partMesh('belts', MB.CreateTorus('e', { diameter: .31, thickness: .045, tessellation: 14 }, scene)),
    skirt: partMesh('tunic hems', MB.CreateCylinder('u', { height: .34, diameterTop: .31, diameterBottom: .46, tessellation: 14 }, scene), down(.17)),
    robe: partMesh('robes', MB.CreateCylinder('g', { height: .9, diameterTop: .34, diameterBottom: .62, tessellation: 16 }, scene), down(.45)),
    upper: partMesh('upper sleeves', MB.CreateCapsule('ua', { radius: .056, height: .34, tessellation: 8 }, scene), down(.15)),
    fore: partMesh('forearms', MB.CreateCapsule('fa', { radius: .047, height: .31, tessellation: 8 }, scene), down(.14)),
    hand: partMesh('hands', MB.CreateSphere('n', { diameter: .085, segments: 6 }, scene), M.Scaling(.8, 1.1, 1)),
    thigh: partMesh('thighs', MB.CreateCapsule('th', { radius: .078, height: .5, tessellation: 8 }, scene), down(.22)),
    shin: partMesh('shins', MB.CreateCapsule('sh', { radius: .062, height: .48, tessellation: 8 }, scene), down(.21)),
    shoe: partMesh('shoes', MB.CreateBox('so', { width: .1, height: .07, depth: .23 }, scene))
  };
  const people = [];
  function person(x, z, yaw, walker, hooded = false) {
    const r = rnd, robed = hooded || r() < .38;
    const headwear = hooded ? 'hood' : robed ? pick(['hood', 'coif', 'coif', 'bare'], r()) : pick(['bare', 'bare', 'hood', 'hat'], r());
    const tunic = rgb(pick(cloth, r())), face = rgb(pick(skin, r())), leather = rgb(pick(['#3a2a1c', '#2a1f16', '#4a3422'], r()));
    const outer = robed ? (r() < .5 ? tunic : rgb(pick(cloth, r()))) : tunic;
    const p = { x, z, yaw, walker, robed, headwear, scale: .9 + r() * .17, phase: r() * 6.28,
      offX: 0, offZ: 0, pace: 1, look: r() * 6.28, lod: 0, slots: {} };
    const color = c => [c.r, c.g, c.b, 1];
    const reserve = (part, c) => {
      const slot = P[part].thinInstanceAdd(M.Identity(), false);
      P[part].thinInstanceSetAttributeAt('color', slot, color(c), false);
      return slot;
    };
    const s = p.slots;
    s.torso = reserve('torso', outer); s.shoulders = reserve('shoulders', outer);
    s.neck = reserve('neck', face); s.head = reserve('head', face); s.nose = reserve('nose', face.scale(.95));
    s.belt = reserve('belt', leather);
    s.lower = robed ? ['robe', reserve('robe', outer)] : ['skirt', reserve('skirt', tunic.scale(.92))];
    const hairColor = rgb(pick(hair, r()));
    if (headwear === 'hood') { const hc = rgb(pick(cloth, r())).scale(.85); s.hood = reserve('hood', hc); s.cowl = reserve('cowl', hc); }
    else s.hair = reserve('hair', headwear === 'coif' ? rgb(pick(linen, r())) : hairColor);
    if (headwear === 'hat') { const felt = rgb(pick(['#3b3024', '#2d2a26', '#5a4630', '#4a3a3a'], r())); s.brim = reserve('brim', felt); s.crown = reserve('crown', felt); }
    const legs = rgb(pick(hose, r()));
    for (const k of ['upper', 'fore', 'hand', 'thigh', 'shin', 'shoe']) {
      const c = k === 'hand' ? face : k === 'thigh' || k === 'shin' ? legs : k === 'shoe' ? leather : outer.scale(k === 'fore' ? .92 : 1);
      s[k] = [reserve(k, c), reserve(k, c)];
    }
    people.push(p);
    return p;
  }
  function populate() {
    // Walkers stroll each street and bridge, turning back at the ends.
    roadLines.forEach(({ road, line, bridge }) => {
      const lengths = [0];
      for (let i = 1; i < line.length; i++) lengths.push(lengths[i - 1] + V3.Distance(line[i - 1], line[i]));
      const total = lengths[lengths.length - 1], count = Math.round(total / (bridge ? 9 : 6.5));
      for (let k = 0; k < count; k++) {
        const p = person(0, 0, 0, true);
        Object.assign(p, { role: 'walk', line, lengths, total, bridge, s: rnd() * total, dir: rnd() < .5 ? 1 : -1,
          lane: (rnd() - .5) * (road.width - 1.1), speed: 1.05 + rnd() * .5 });
      }
    });
    // Other districts (the Bellows) register folk before the buffers are sized.
    (W.extraFolk || []).forEach(e => {
      const p = person(e.x, e.z, e.yaw || 0, !!e.line, e.hooded);
      p.baseY = e.baseY || 0;
      if (e.line) {
        const lengths = [0];
        for (let i = 1; i < e.line.length; i++) lengths.push(lengths[i - 1] + V3.Distance(e.line[i - 1], e.line[i]));
        Object.assign(p, { line: e.line, lengths, total: lengths[lengths.length - 1], s: rnd() * lengths[lengths.length - 1],
          dir: rnd() < .5 ? 1 : -1, lane: e.lane || 0, speed: e.speed || .9 });
      }
    });
    // Vendors behind the stalls, and customers in front of some.
    W.stalls.forEach((s, i) => {
      person(s.x, s.z - 1.05, 0, false).role = 'vendor';
      if (hash(i * 4.4) > .45) person(s.x + (hash(i) - .5), s.z + 1.35, Math.PI, false).role = 'talk';
    });
    // Neighbours chatting at the roadside.
    roadLines.forEach(({ road, line, bridge }, ri) => {
      if (bridge) return;
      for (let i = 4; i < line.length - 4; i += 7) {
        if (hash(ri * 71 + i) > .55) continue;
        const a = line[i], t = line[i + 1].subtract(a).normalize();
        const side = hash(ri + i * 3) > .5 ? 1 : -1;
        const c = a.add(new V3(t.z, 0, -t.x).scale(side * (road.width / 2 + .7)));
        const n = 2 + Math.floor(hash(ri * 3 + i) * 2);
        for (let k = 0; k < n; k++) {
          const ang = k * Math.PI * 2 / n + hash(i + k);
          const x = c.x + Math.sin(ang) * .55, z = c.z + Math.cos(ang) * .55;
          if (freeAt(x, z, .25)) person(x, z, ang + Math.PI, false).role = 'talk';
        }
      }
    });
  }

  // ------------------------------------------------------------ traffic
  // Carts yield to anyone standing in their path; walkers step aside for
  // carts, keep a little room from each other, and pause for the player.
  const player = () => W.camera.position;
  const cartFrame = c => ({ fx: Math.sin(c.yaw), fz: Math.cos(c.yaw), rx: Math.cos(c.yaw), rz: -Math.sin(c.yaw) });
  function cartClear(c) {
    const { fx, fz, rx, rz } = cartFrame(c);
    const inPath = (x, z, reach) => {
      const dx = x - c.x, dz = z - c.z, ahead = dx * fx + dz * fz, side = dx * rx + dz * rz;
      return ahead > 1.2 && ahead < reach && Math.abs(side) < 1.1;
    };
    const cam = player();
    if (inPath(cam.x, cam.z, 6.8)) return false;
    for (const p of people) if (p.follow !== c && inPath(p.x, p.z, 5.2)) return false;
    for (const o of travellers) if (o !== c && inPath(o.x, o.z, 9)) return false;
    return true;
  }
  // Solid footprint of a travelling cart and its horse, for the player.
  function inCart(c, x, z, margin) {
    const { fx, fz, rx, rz } = cartFrame(c);
    const dx = x - c.x - fx * 1.5, dz = z - c.z - fz * 1.5;
    return Math.abs(dx * rx + dz * rz) < .85 + margin && Math.abs(dx * fx + dz * fz) < 2.9 + margin;
  }
  W.dynamicBlocked = (x, z, fromX, fromZ) => {
    for (const c of travellers) if (inCart(c, x, z, .3) && !inCart(c, fromX, fromZ, .3)) return true;
    for (const p of people) {
      const d = Math.hypot(x - p.x, z - p.z);
      if (d < .55 && d < Math.hypot(fromX - p.x, fromZ - p.z)) return true;
    }
    return false;
  };
  function avoid(p, dt) {
    let wantX = 0, wantZ = 0, pace = 1;
    for (const c of travellers) {
      const { fx, fz, rx, rz } = cartFrame(c);
      const dx = p.x - p.offX - c.x, dz = p.z - p.offZ - c.z;
      const ahead = dx * fx + dz * fz, side = dx * rx + dz * rz;
      if (ahead > -2 && ahead < 7.5 && Math.abs(side) < 1.9) {
        const push = Math.min(1.6, 1.9 - Math.abs(side)) * (side >= 0 ? 1 : -1);
        wantX += rx * push; wantZ += rz * push;
      }
    }
    const cam = player(), fx = Math.sin(p.yaw), fz = Math.cos(p.yaw);
    const px = cam.x - p.x, pz = cam.z - p.z, ahead = px * fx + pz * fz;
    if (ahead > 0 && ahead < 1.4 && Math.abs(px * fz - pz * fx) < .6) pace = 0;
    for (const o of people) {
      if (o === p) continue;
      const ox = p.x - o.x, oz = p.z - o.z, d = Math.hypot(ox, oz);
      if (d > .01 && d < .6) { wantX += ox / d * (.6 - d); wantZ += oz / d * (.6 - d); }
    }
    const k = Math.min(1, dt * 3);
    p.offX += (wantX - p.offX) * k; p.offZ += (wantZ - p.offZ) * k;
    p.pace += (pace - p.pace) * Math.min(1, dt * 5);
  }

  // ------------------------------------------------------------- posing
  const tmp = { root: new M(), out: new M(), a: new M(), b: new M(), c: new M(), u: new M(), l: new M(), h: new M() };
  const buffers = {};
  function write(part, slot, local) {
    local.multiplyToRef(tmp.root, tmp.out);
    tmp.out.copyToArray(buffers[part], slot * 16);
  }
  function at(part, slot, x, y, z) { M.TranslationToRef(x, y, z, tmp.a); write(part, slot, tmp.a); }
  // Two-bone limb: upper swings from the joint, lower bends at knee/elbow,
  // and the end piece (hand or shoe) follows the lower bone.
  function limb(upper, lower, end, i, slots, x, y, splay, a1, a2, len1, len2, endY, endZ) {
    M.RotationXToRef(a1, tmp.a); M.RotationZToRef(splay, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.c);
    M.TranslationToRef(x, y, 0, tmp.a); tmp.c.multiplyToRef(tmp.a, tmp.u);
    write(upper, slots[upper][i], tmp.u);
    M.RotationXToRef(a2, tmp.a); M.TranslationToRef(0, -len1, 0, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.c);
    tmp.c.multiplyToRef(tmp.u, tmp.l);
    write(lower, slots[lower][i], tmp.l);
    M.TranslationToRef(0, -len2 + endY, endZ, tmp.a); tmp.a.multiplyToRef(tmp.l, tmp.c);
    write(end, slots[end][i], tmp.c);
  }
  function headPart(part, slot, x, y, z, sx = 1, sy = 1, sz = 1) {
    M.ScalingToRef(sx, sy, sz, tmp.a); M.TranslationToRef(x, y, z, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.c);
    tmp.c.multiplyToRef(tmp.h, tmp.a); write(part, slot, tmp.a);
  }
  function pose(p, dt) {
    let moving = false, speed = 0;
    if (p.follow) {
      // A carter leads the horse by its head, on the side nearer the crown of the road.
      const c = p.follow, cos = Math.cos(c.yaw), sin = Math.sin(c.yaw);
      p.x = c.x - .8 * cos + 3.3 * sin; p.z = c.z + .8 * sin + 3.3 * cos; p.yaw = c.yaw;
      speed = c.v; moving = speed > .05;
    } else if (p.walker) {
      avoid(p, dt);
      speed = p.speed * p.pace;
      p.s += p.dir * speed * dt;
      if (p.s < 0 || p.s > p.total) { p.dir *= -1; p.s = Math.max(0, Math.min(p.total, p.s)); }
      let i = 1; while (i < p.line.length - 1 && p.lengths[i] < p.s) i++;
      const a = p.line[i - 1], b = p.line[i], f = (p.s - p.lengths[i - 1]) / (p.lengths[i] - p.lengths[i - 1] || 1);
      const tx = (b.x - a.x) * p.dir, tz = (b.z - a.z) * p.dir, len = Math.hypot(tx, tz) || 1;
      p.x = a.x + (b.x - a.x) * f + tz / len * p.lane * p.dir + p.offX;
      p.z = a.z + (b.z - a.z) * f - tx / len * p.lane * p.dir + p.offZ;
      let turn = Math.atan2(tx, tz) - p.yaw; turn = Math.atan2(Math.sin(turn), Math.cos(turn));
      p.yaw += turn * Math.min(1, dt * 6);
      moving = speed > .05;
    }
    p.phase += moving ? dt * speed * 5.2 : dt * .9;
    p.look += dt * .35;
    const ph = p.phase, stride = moving ? Math.min(1, speed / 1.1) : 0;
    const bob = moving ? Math.abs(Math.cos(ph)) * .03 * stride : 0;
    let y = p.baseY || 0;
    if (p.bridge) { const q = pct(p); y = W.bridgeRiseAt(q.x, q.y); }
    p.moving = moving; p.curSpeed = speed; p.drawY = y;
    if (RIG.ready) return;
    M.ComposeToRef(new V3(p.scale, p.scale, p.scale), Q.RotationYawPitchRoll(p.yaw + (moving ? Math.sin(ph) * .05 : 0), 0, 0), new V3(p.x, y + bob, p.z), tmp.root);
    const s = p.slots;
    at('torso', s.torso, 0, .96, 0); at('shoulders', s.shoulders, 0, 1.43, 0); at('neck', s.neck, 0, 1.53, 0);
    at('belt', s.belt, 0, .99, 0); at(s.lower[0], s.lower[1], 0, .99, 0);
    // The head turns to look about when standing, and forward when walking.
    const turn = moving ? 0 : Math.sin(p.look) * Math.sin(p.look * .37) * .5;
    M.RotationYToRef(turn, tmp.a); M.TranslationToRef(0, 1.66, 0, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.h);
    headPart('head', s.head, 0, 0, 0); headPart('nose', s.nose, 0, -.01, .1);
    if (s.hair !== undefined) headPart('hair', s.hair, 0, .015, -.012);
    if (s.hood !== undefined) { headPart('hood', s.hood, 0, .0, -.022); headPart('cowl', s.cowl, 0, -.14, -.01, 1, .8, 1); }
    if (s.brim !== undefined) { headPart('brim', s.brim, 0, .1, 0); headPart('crown', s.crown, 0, .1, 0); }
    for (const i of [0, 1]) {
      const side = i ? 1 : -1, swing = Math.sin(ph) * side;
      const thigh = moving ? -.42 * swing * stride : 0;
      const knee = moving ? (.1 + .75 * Math.max(0, Math.cos(ph) * side) ** 1.5) * stride : .03;
      limb('thigh', 'shin', 'shoe', i, s, side * .09, .95, 0, thigh, knee, .44, .43, -.04, .05);
      const shoulder = moving ? .38 * swing * stride : Math.sin(ph + i) * .03;
      const elbow = -(.22 + (moving ? .25 * Math.max(0, -swing) * stride : 0));
      limb('upper', 'fore', 'hand', i, s, side * .225, 1.44, side * .07, shoulder, elbow, .3, .28, -.02, 0);
    }
  }
  // ------------------------------------------------ rigged townsfolk
  // Quaternius CC0 characters (peasant and ranger outfits, Universal Animation
  // Library clips), assembled in Blender (scripts/build-basctdelm-folk.py).
  // Each variant's walk/idle/talk clips are baked into a bone-matrix texture
  // so hundreds of animated people draw as a few instanced calls instead of
  // hundreds of skeletons. The procedural figures stay until the cast loads.
  const RIG = { ready: false, variants: [], yawOffset: 0, lift: 0 };
  const RIG_DIR = 'images/city-scenes/basctdelm/characters/';
  const RIG_NAMES = ['man_peasant_a', 'man_peasant_b', 'man_peasant_c', 'woman_peasant_a', 'woman_peasant_b', 'woman_peasant_c', 'man_ranger', 'woman_ranger'];
  const CLIPS = ['Walk_Loop', 'Idle_Loop', 'Idle_Talking_Loop'];
  const WALK_MPS = 1.25, BAKE_FPS = 30;
  async function loadVariant(name) {
    const res = await BABYLON.SceneLoader.ImportMeshAsync('', RIG_DIR, name + '.glb', scene);
    // The loader splits one mesh per material (body, clothes, hair, eyes...);
    // they share one skeleton, so they share one baked animation texture.
    const parts = res.meshes.filter(m => m.skeleton && m.getTotalVertices() > 0), mesh = parts[0];
    const skel = mesh.skeleton, groups = res.animationGroups;
    groups.forEach(g => g.stop());
    const stride = (skel.bones.length + 1) * 16, rows = [], ranges = {};
    for (const clip of CLIPS) {
      const g = groups.find(x => x.name === clip), step = 60 / BAKE_FPS, first = rows.length;
      g.start(false, 1, g.from, g.to); g.pause();
      for (let fr = g.from; fr < g.to - step * .5; fr += step) {
        g.goToFrame(fr); skel.prepare(true);
        rows.push(Float32Array.from(skel.getTransformMatrices(mesh)));
      }
      g.stop();
      ranges[clip] = [first, rows.length - 1];
    }
    const data = new Float32Array(rows.length * stride);
    rows.forEach((r, k) => data.set(r, k * stride));
    const manager = new BABYLON.BakedVertexAnimationManager(scene);
    manager.texture = new BABYLON.VertexAnimationBaker(scene, mesh).textureFromBakedVertexData(data);
    groups.forEach(g => g.dispose());
    res.meshes.forEach(m => { m.isPickable = false; });
    parts.forEach(m => {
      m.bakedVertexAnimationManager = manager;
      m.alwaysSelectAsActiveMesh = true; m.receiveShadows = true;
      shadows.addShadowCaster(m, false);
    });
    return { name, mesh, parts, manager, ranges, inv: mesh.computeWorldMatrix(true).clone().invert(), members: [] };
  }
  async function loadRigged() {
    try { RIG.variants = await Promise.all(RIG_NAMES.map(loadVariant)); }
    catch (error) { console.warn('Rigged townsfolk unavailable; keeping procedural figures:', error); return; }
    const rangers = RIG.variants.filter(v => /ranger/.test(v.name)), commoners = RIG.variants.filter(v => !/ranger/.test(v.name));
    people.forEach((p, k) => {
      // Hooded folk (the Bellows) wear the hooded ranger outfits; a few rangers walk the surface too.
      const pool = p.headwear === 'hood' && p.baseY ? rangers : hash(k * 3.7) < .12 ? rangers : commoners;
      const v = pool[Math.floor(hash(k * 1.31) * pool.length) % pool.length];
      p.rig = { v, slot: v.members.length, state: null, fps: 0 };
      v.members.push(p);
    });
    RIG.variants.forEach(v => {
      const n = Math.max(1, v.members.length);
      v.matrices = new Float32Array(n * 16); v.settings = new Float32Array(n * 4);
      v.parts.forEach(m => {
        m.thinInstanceSetBuffer('matrix', v.matrices, 16, false);
        m.thinInstanceSetBuffer('bakedVertexAnimationSettingsInstanced', v.settings, 4, false);
        if (!v.members.length) m.setEnabled(false);
      });
    });
    for (const part in P) P[part].setEnabled(false);
    RIG.ready = true;
    drawRigged(0);
  }
  const rm = { a: new M(), b: new M(), s: new V3(), p: new V3(), q: new Q() };
  function drawRigged(dt) {
    for (const v of RIG.variants) {
      let dirty = false;
      for (const p of v.members) {
        rm.s.set(p.scale, p.scale, p.scale); rm.p.set(p.x, (p.drawY || 0) + RIG.lift, p.z);
        Q.RotationYawPitchRollToRef(p.yaw + RIG.yawOffset, 0, 0, rm.q);
        M.ComposeToRef(rm.s, rm.q, rm.p, rm.a);
        rm.a.multiplyToRef(v.inv, rm.b); rm.b.copyToArray(v.matrices, p.rig.slot * 16);
        const state = p.moving ? 'Walk_Loop' : p.role === 'talk' ? 'Idle_Talking_Loop' : 'Idle_Loop';
        const fps = state === 'Walk_Loop' ? BAKE_FPS * Math.max(.6, Math.min(1.6, (p.curSpeed || WALK_MPS) / WALK_MPS)) : BAKE_FPS;
        if (state !== p.rig.state || Math.abs(fps - p.rig.fps) > 2) {
          const r = v.ranges[state];
          v.settings.set([r[0], r[1], hash(p.rig.slot * 7.7 + v.name.length) * 90, fps], p.rig.slot * 4);
          p.rig.state = state; p.rig.fps = fps; dirty = true;
        }
      }
      for (const m of v.parts) {
        m.thinInstanceBufferUpdated('matrix');
        if (dirty) m.thinInstanceBufferUpdated('bakedVertexAnimationSettingsInstanced');
      }
      v.manager.time += dt;
    }
  }
  const camFar = 70 * 70;
  function animate() {
    if (W.isAerial()) return;
    const dt = Math.min(scene.getEngine().getDeltaTime() / 1000, .05);
    moveCarts(dt);
    rolling.body.thinInstanceBufferUpdated('matrix');
    rolling.wheel.thinInstanceBufferUpdated('matrix');
    // Distant people are re-posed a quarter as often; fog hides the difference.
    const cam = player();
    for (const p of people) {
      p.lod += dt;
      const far = (p.x - cam.x) ** 2 + (p.z - cam.z) ** 2 > camFar;
      if (!far || p.lod > .12) { pose(p, p.lod); p.lod = 0; }
    }
    if (RIG.ready) drawRigged(dt); else for (const part in P) P[part].thinInstanceBufferUpdated('matrix');
    for (const h of horses) { if (!h.moving) h.phase += dt; poseHorse(h); }
    for (const part in H) H[part].thinInstanceBufferUpdated('matrix');
  }

  parkCarts();
  driveCarts();
  populate();
  for (const part in H) {
    H[part].thinInstanceBufferUpdated('color');
    hBuf[part] = new Float32Array(H[part].thinInstanceCount * 16);
    H[part].thinInstanceSetBuffer('matrix', hBuf[part], 16, false);
  }
  moveCarts(0);
  horses.forEach(poseHorse);
  for (const part in P) P[part].thinInstanceBufferUpdated('color');
  // Each part owns one matrix buffer that pose() rewrites in place every frame.
  for (const part in P) {
    buffers[part] = new Float32Array(P[part].thinInstanceCount * 16);
    P[part].thinInstanceSetBuffer('matrix', buffers[part], 16, false);
  }
  people.forEach(p => pose(p, 0));
  scene.onBeforeRenderObservable.add(animate);
  loadProps();
  // The rigged cast streams in after the city is on screen.
  setTimeout(loadRigged, 400);
  W.life = { people, carts, horses, travellers, rig: RIG };
})();
