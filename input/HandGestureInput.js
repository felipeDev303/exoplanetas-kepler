// HandGestureInput.js
// Wrapper para MediaPipe Hands / entrada de gestos manuales

export default class HandGestureInput {
  constructor() {
    this.enabled = false;
  }

  async init() {
    // inicializar MediaPipe aquí
    this.enabled = true;
  }

  onGesture(fn) {
    this._onGesture = fn;
  }
}
