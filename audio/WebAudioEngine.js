// WebAudioEngine.js
// Motor básico Web Audio API

export default class WebAudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  createOscillator(freq = 440) {
    const osc = this.ctx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    return osc;
  }
}
