// GeometryHelpers.js
// Helpers de geometría

export function polarToCartesian(r, theta) {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}
