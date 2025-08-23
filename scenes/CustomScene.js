// CustomScene.js
// Escena base para extensiones personalizadas

export default class CustomScene {
  constructor(renderer) {
    this.renderer = renderer;
  }
  load(config) {
    this.config = config;
  }
  update(dt) {}
}
