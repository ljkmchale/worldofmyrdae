const test = require('node:test');
const assert = require('node:assert/strict');
const nav = require('../js/basctdelm-navigation.js');

test('map coordinates keep north above south and round-trip the source pins', () => {
  const keep = nav.mapToWorld(10.8, 18.5);
  const beacon = nav.mapToWorld(86, 38.7);
  const crossway = nav.mapToWorld(93.3, 83.5);
  assert.ok(keep.z > beacon.z && beacon.z > crossway.z);
  assert.ok(keep.x < beacon.x && beacon.x < crossway.x);
  for (const [x, y] of [[10.8,18.5],[86,38.7],[21.6,50],[93.3,83.5]]) {
    const world = nav.mapToWorld(x,y);
    const restored = nav.worldToMap(world.x,world.z);
    assert.ok(Math.abs(restored.x-x)<1e-10);
    assert.ok(Math.abs(restored.y-y)<1e-10);
  }
});

test('mouse look rejects capture spikes and caps vertical pitch', () => {
  assert.deepEqual(nav.look(0,0,900,0),{yaw:0,pitch:0});
  const modest = nav.look(0,0,40,20);
  assert.equal(modest.yaw,.14);
  assert.equal(modest.pitch,.07);
  assert.equal(nav.look(0,1.1,0,100).pitch,1.15);
  let turn={yaw:0,pitch:0};
  for(let i=0;i<45;i++) turn=nav.look(turn.yaw,turn.pitch,40,0);
  assert.ok(Math.abs(turn.yaw-Math.PI*2)<.02,'repeated mouse movement reaches a full turn');
});

test('WASD motion is frame-rate based and diagonals do not move faster', () => {
  const forward = nav.walkingDelta(0,1,0,3.6,.05);
  const diagonal = nav.walkingDelta(0,1,1,3.6,.05);
  assert.equal(forward.x,0);
  assert.ok(Math.abs(forward.z-.18)<1e-10);
  assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-.18)<1e-10);
  assert.deepEqual(nav.walkingDelta(0,0,0,3.6,.05),{x:0,z:0});
  assert.ok(Math.abs(nav.walkingDelta(0,1,0,3.6,1).z-.18)<1e-10);
});
