// MockDataGenerator.js
// Generador de datos de prueba para desarrollo offline

export function mockPlanets(count = 20) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      name: `Mock-${i + 1}`,
      orbitalPeriod: Math.random() * 500,
      radius: Math.random() * 15 + 0.3,
    });
  }
  return arr;
}
