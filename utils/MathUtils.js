// MathUtils.js
// Utilidades matemáticas comunes

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
export function mapRange(v, a, b, x, y) {
  return x + (y - x) * ((v - a) / (b - a));
}
