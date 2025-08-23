// MIDIInput.js
// WebMIDI / webmidi wrapper para recibir MIDI desde Ableton

export default class MIDIInput {
  constructor() {
    this.inputs = [];
    this.enabled = false;
  }

  async init() {
    if (!navigator.requestMIDIAccess) throw new Error("WebMIDI no soportado");
    const access = await navigator.requestMIDIAccess();
    this._onMIDI = this._onMIDI.bind(this);
    for (const input of access.inputs.values()) {
      input.onmidimessage = this._onMIDI;
      this.inputs.push(input);
    }
    this.enabled = true;
  }

  _onMIDI(msg) {
    if (this.onMessage) this.onMessage(msg);
  }

  onMessage(fn) {
    this.onMessage = fn;
  }
}
