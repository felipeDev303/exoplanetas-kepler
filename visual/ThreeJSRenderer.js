// ThreeJSRenderer.js
// Renderer básico usando Three.js

import * as THREE from "three";

export default class ThreeJSRenderer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this._animId = requestAnimationFrame(() => this.animate());
    this.render();
  }

  stop() {
    cancelAnimationFrame(this._animId);
  }
}
