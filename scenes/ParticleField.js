// ParticleField.js
// Escena: campo de partículas generado desde datos

export default class ParticleField {
  constructor(renderer) {
    this.renderer = renderer;
  }
  load(planets) {
    this.planets = planets;
  }
  update(dt) {}
}
