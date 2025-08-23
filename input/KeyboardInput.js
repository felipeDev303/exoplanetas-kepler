// KeyboardInput.js
// Controles simples por teclado

export default class KeyboardInput {
  constructor() {}
  init() {
    window.addEventListener("keydown", (e) => {
      if (this.onKey) this.onKey(e);
    });
  }
  onKey(fn) {
    this.onKey = fn;
  }
}
