(function (root, factory) {
  const navigation = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = navigation;
  if (root) root.BasctdelmNavigation = navigation;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const WIDTH = 300;
  const DEPTH = 300 * 1824 / 2324;
  function mapToWorld(x, y, height = 0) {
    return { x: (x - 50) * WIDTH / 100, y: height, z: (50 - y) * DEPTH / 100 };
  }
  function worldToMap(x, z) {
    return { x: x / WIDTH * 100 + 50, y: 50 - z / DEPTH * 100 };
  }
  function look(yaw, pitch, movementX, movementY, sensitivity = .0035) {
    if (!Number.isFinite(movementX) || !Number.isFinite(movementY) ||
        Math.abs(movementX) > 250 || Math.abs(movementY) > 250) return { yaw, pitch };
    return {
      yaw: yaw + movementX * sensitivity,
      pitch: Math.max(-1.15, Math.min(1.15, pitch + movementY * sensitivity))
    };
  }
  function walkingDelta(yaw, forward, strafe, speed, deltaSeconds) {
    const length = Math.hypot(forward, strafe);
    if (!length) return { x: 0, z: 0 };
    const amount = speed * Math.min(Math.max(deltaSeconds, 0), .05) / length;
    return {
      x: (Math.sin(yaw) * forward + Math.cos(yaw) * strafe) * amount,
      z: (Math.cos(yaw) * forward - Math.sin(yaw) * strafe) * amount
    };
  }
  return { WIDTH, DEPTH, mapToWorld, worldToMap, look, walkingDelta };
});
