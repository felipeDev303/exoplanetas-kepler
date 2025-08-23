// OrbitalSystem.js
// Escena: sistema orbital simple basada en datos planetarios

export default class OrbitalSystem {
  constructor(renderer) {
    this.renderer = renderer;
  }

  load(planets) {
    this.planets = planets;
  }

  update(dt) {
    // animación basada en periodo orbital
  }

  dispose() {}
}
