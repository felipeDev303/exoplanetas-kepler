// Performance.js
// Monitoreo simple de rendimiento

export function now() {
  return performance.now();
}
export function fpsMonitor(callback) {
  let last = performance.now();
  let frames = 0;
  function tick() {
    frames++;
    const t = performance.now();
    if (t - last >= 1000) {
      callback(frames);
      frames = 0;
      last = t;
    }
    requestAnimationFrame(tick);
  }
  tick();
}
