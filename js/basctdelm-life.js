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
  function buildCart() {
    const parts = [];
    const add = (mesh, mat, x, y, z, rx = 0, rz = 0) => {
      mesh.position.set(x, y, z); mesh.rotation.x = rx; mesh.rotation.z = rz; mesh.material = mat; parts.push(mesh);
    };
    const B = (w, h, d) => BABYLON.MeshBuilder.CreateBox('cart part', { width: w, height: h, depth: d }, scene);
    add(B(1.3, .1, 2), mats.wood, 0, .78, 0);
    for (const s of [-1, 1]) {
      add(B(.06, .36, 2), mats.wood, s * .62, 1.0, 0);
      add(B(1.3, .36, .06), mats.wood, 0, 1.0, s * .98);
      // Shafts run forward and down to rest on the cobbles.
      add(B(.07, .07, 2.3), mats.timber, s * .45, .55, 2.0, .2);
      const rim = BABYLON.MeshBuilder.CreateTorus('cart wheel rim', { diameter: 1.08, thickness: .08, tessellation: 24 }, scene);
      add(rim, iron, s * .76, .55, -.1, 0, Math.PI / 2);
      for (let k = 0; k < 4; k++) add(B(.05, 1.02, .05), mats.timber, s * .76, .55, -.1, k * Math.PI / 4);
      const hub = BABYLON.MeshBuilder.CreateCylinder('cart hub', { diameter: .2, height: .22, tessellation: 10 }, scene);
      add(hub, mats.timber, s * .76, .55, -.1, 0, Math.PI / 2);
    }
    const axle = BABYLON.MeshBuilder.CreateCylinder('cart axle', { diameter: .08, height: 1.6, tessellation: 8 }, scene);
    add(axle, iron, 0, .55, -.1, 0, Math.PI / 2);
    const cart = BABYLON.Mesh.MergeMeshes(parts, true, true, undefined, false, true);
    cart.name = 'hand carts';
    return prepare(cart);
  }
  const carts = [];
  function parkCarts() {
    const cart = buildCart();
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
        // Check the bed, wheels and shaft tips all sit on clear ground.
        const probes = [[0, 0], [0, 1.6], [0, -1.1], [.8, 0], [-.8, 0]];
        if (!probes.every(([u, v]) => {
          const x = c.x + u * fz + v * fx, z = c.z - u * fx + v * fz;
          return !collisions.some(k => hitsCollider(k, x, z, .15)) && roadClearance(x, z) > -.1;
        })) continue;
        cart.thinInstanceAdd(place(c.x, 0, c.z, yaw));
        occupy(c.x + fx * .6, c.z + fz * .6, .8, 1.9, yaw, 'cart');
        carts.push({ x: c.x, z: c.z, yaw, loaded: hash(ri * 5 + i) > .45 });
      }
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
  const cloth = ['#6b4a32', '#7a6a4a', '#4b5a3a', '#5e3b36', '#3f4a5a', '#8a7a5a', '#6a6a62', '#8c5a3a', '#4a3a52', '#a89878', '#7d3b2e', '#2f3d33', '#55493c'];
  const skin = ['#e3bb9c', '#c9976f', '#a36f4c', '#7a4e33', '#efc9ab', '#d7a886'];
  const hair = ['#2b2018', '#4a3322', '#7a5a38', '#1c1a18', '#8a8070', '#5b3a20'];
  const hose = ['#2e2a26', '#3b3228', '#403a33', '#2c3330', '#4a3a2c'];
  function partMesh(name, mesh, pivotDrop) {
    // Joints pivot at the top of the geometry (shoulder, hip, neck).
    if (pivotDrop) mesh.bakeTransformIntoVertices(M.Translation(0, -pivotDrop, 0));
    const mat = new BABYLON.StandardMaterial(name + ' material', scene);
    mat.diffuseColor = new BABYLON.Color3(.62, .62, .62); mat.specularColor = rgb('#0d0d0d');
    mesh.material = mat; mesh.name = 'townsfolk ' + name;
    mesh.thinInstanceRegisterAttribute('color', 4);
    return prepare(mesh);
  }
  const P = {
    torso: partMesh('torso', BABYLON.MeshBuilder.CreateCylinder('t', { height: .56, diameterTop: .4, diameterBottom: .32, tessellation: 12 }, scene), -.28),
    robe: partMesh('robe', BABYLON.MeshBuilder.CreateCylinder('r', { height: .9, diameterTop: .36, diameterBottom: .64, tessellation: 14 }, scene), .45),
    head: partMesh('head', BABYLON.MeshBuilder.CreateSphere('h', { diameter: .22, segments: 10 }, scene)),
    hair: partMesh('hair or hood', BABYLON.MeshBuilder.CreateSphere('c', { diameter: .25, segments: 10, slice: .62 }, scene)),
    arm: partMesh('sleeve', BABYLON.MeshBuilder.CreateCapsule('a', { radius: .058, height: .62, tessellation: 8 }, scene), .31),
    hand: partMesh('hand', BABYLON.MeshBuilder.CreateSphere('n', { diameter: .1, segments: 6 }, scene)),
    leg: partMesh('leg', BABYLON.MeshBuilder.CreateCapsule('l', { radius: .075, height: .9, tessellation: 8 }, scene), .45)
  };
  const people = [];
  function person(x, z, yaw, walker) {
    const r = rnd, robed = r() < .38, hooded = r() < .3;
    const tunic = rgb(pick(cloth, r())), face = rgb(pick(skin, r()));
    const p = {
      x, z, yaw, walker, robed, scale: .9 + r() * .17, phase: r() * 6.28,
      colors: {
        torso: tunic, robe: robed ? (r() < .5 ? tunic : rgb(pick(cloth, r()))) : null,
        head: face, hand: face, arm: tunic.scale(.88),
        hair: hooded ? rgb(pick(cloth, r())).scale(.8) : rgb(pick(hair, r())),
        leg: rgb(pick(hose, r()))
      },
      hood: hooded
    };
    p.slots = {};
    const color = c => [c.r, c.g, c.b, 1];
    const reserve = (part, c) => {
      const slot = P[part].thinInstanceAdd(M.Identity(), false);
      P[part].thinInstanceSetAttributeAt('color', slot, color(c), false);
      return slot;
    };
    for (const part of ['torso', 'head', 'hair']) p.slots[part] = reserve(part, p.colors[part]);
    if (robed) p.slots.robe = reserve('robe', p.colors.robe);
    p.slots.arms = [reserve('arm', p.colors.arm), reserve('arm', p.colors.arm)];
    p.slots.hands = [reserve('hand', p.colors.hand), reserve('hand', p.colors.hand)];
    p.slots.legs = [reserve('leg', p.colors.leg), reserve('leg', p.colors.leg)];
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
        Object.assign(p, { line, lengths, total, bridge, s: rnd() * total, dir: rnd() < .5 ? 1 : -1,
          lane: (rnd() - .5) * (road.width - 1.1), speed: 1.05 + rnd() * .5 });
      }
    });
    // Vendors behind the stalls, and customers in front of some.
    W.stalls.forEach((s, i) => {
      person(s.x, s.z - 1.05, 0, false);
      if (hash(i * 4.4) > .45) person(s.x + (hash(i) - .5), s.z + 1.35, Math.PI, false);
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
          if (freeAt(x, z, .25)) person(x, z, ang + Math.PI, false);
        }
      }
    });
  }

  const tmp = { root: new M(), local: new M(), out: new M(), a: new M(), b: new M() };
  const buffers = {};
  function write(part, slot, local) {
    local.multiplyToRef(tmp.root, tmp.out);
    tmp.out.copyToArray(buffers[part], slot * 16);
  }
  function limb(part, slot, x, y, z, swing, childPart, childSlot, length) {
    M.RotationXToRef(swing, tmp.a);
    M.TranslationToRef(x, y, z, tmp.b);
    tmp.a.multiplyToRef(tmp.b, tmp.local);
    write(part, slot, tmp.local);
    if (childPart) {
      M.TranslationToRef(0, -length, 0, tmp.a);
      tmp.a.multiplyToRef(tmp.local, tmp.b);
      write(childPart, childSlot, tmp.b);
    }
  }
  function pose(p, dt) {
    let bob = 0, swing = 0;
    if (p.walker) {
      p.s += p.dir * p.speed * dt;
      if (p.s < 0 || p.s > p.total) { p.dir *= -1; p.s = Math.max(0, Math.min(p.total, p.s)); }
      let i = 1; while (i < p.line.length - 1 && p.lengths[i] < p.s) i++;
      const a = p.line[i - 1], b = p.line[i], f = (p.s - p.lengths[i - 1]) / (p.lengths[i] - p.lengths[i - 1] || 1);
      const tx = (b.x - a.x) * p.dir, tz = (b.z - a.z) * p.dir, len = Math.hypot(tx, tz) || 1;
      p.x = a.x + (b.x - a.x) * f + tz / len * p.lane * p.dir;
      p.z = a.z + (b.z - a.z) * f - tx / len * p.lane * p.dir;
      const target = Math.atan2(tx, tz);
      let turn = target - p.yaw; turn = Math.atan2(Math.sin(turn), Math.cos(turn));
      p.yaw += turn * Math.min(1, dt * 6);
      p.phase += dt * p.speed * 5.2;
      swing = Math.sin(p.phase) * .5; bob = Math.abs(Math.cos(p.phase)) * .035;
    } else {
      p.phase += dt * .9;
      swing = Math.sin(p.phase) * .04;
    }
    let y = 0;
    if (p.bridge) { const q = pct(p); y = W.bridgeRiseAt(q.x, q.y); }
    M.ComposeToRef(new V3(p.scale, p.scale, p.scale), Q.RotationYawPitchRoll(p.yaw, 0, 0), new V3(p.x, y + bob, p.z), tmp.root);
    M.TranslationToRef(0, .92, 0, tmp.local); write('torso', p.slots.torso, tmp.local);
    if (p.robed) { M.TranslationToRef(0, .98, 0, tmp.local); write('robe', p.slots.robe, tmp.local); }
    M.ScalingToRef(1, 1.12, 1, tmp.a); M.TranslationToRef(0, 1.6, .01, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.local);
    write('head', p.slots.head, tmp.local);
    const hs = p.hood ? 1.14 : 1;
    M.ScalingToRef(hs, hs, hs, tmp.a); M.TranslationToRef(0, p.hood ? 1.6 : 1.62, p.hood ? -.02 : -.012, tmp.b); tmp.a.multiplyToRef(tmp.b, tmp.local);
    write('hair', p.slots.hair, tmp.local);
    const legSwing = p.robed ? swing * .6 : swing;
    for (const s of [0, 1]) {
      const sign = s ? 1 : -1;
      limb('leg', p.slots.legs[s], sign * .09, .92, 0, sign * legSwing);
      limb('arm', p.slots.arms[s], sign * .235, 1.43, 0, -sign * swing * .75, 'hand', p.slots.hands[s], .64);
    }
  }
  function animate() {
    if (W.isAerial()) return;
    const dt = Math.min(scene.getEngine().getDeltaTime() / 1000, .05);
    for (const p of people) pose(p, dt);
    for (const part in P) P[part].thinInstanceBufferUpdated('matrix');
  }

  parkCarts();
  populate();
  for (const part in P) P[part].thinInstanceBufferUpdated('color');
  // Each part owns one matrix buffer that pose() rewrites in place every frame.
  for (const part in P) {
    buffers[part] = new Float32Array(P[part].thinInstanceCount * 16);
    P[part].thinInstanceSetBuffer('matrix', buffers[part], 16, false);
  }
  people.forEach(p => pose(p, 0));
  scene.onBeforeRenderObservable.add(animate);
  loadProps();
  W.life = { people, carts };
})();
