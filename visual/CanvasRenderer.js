// CanvasRenderer.js
// Renderer 2D básico

export default class CanvasRenderer {
  constructor(container, width = 800, height = 600) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
