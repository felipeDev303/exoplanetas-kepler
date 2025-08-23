// DataProcessor.js
// Procesamiento y filtrado de datos Kepler

export function normalizePlanets(raw) {
  return raw
    .map((p) => ({
      name: p.pl_name,
      orbitalPeriod: Number(p.pl_orbper),
      radius: Number(p.pl_rade),
    }))
    .filter((p) => !isNaN(p.orbitalPeriod) && !isNaN(p.radius));
}
