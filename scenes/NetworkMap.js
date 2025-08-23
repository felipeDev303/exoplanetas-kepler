// NetworkMap.js
// Escena: nodes conectados representando exoplanetas

export default class NetworkMap {
  constructor(renderer) {
    this.renderer = renderer;
  }
  load(planets) {
    this.planets = planets;
  }
  update(dt) {}
}
