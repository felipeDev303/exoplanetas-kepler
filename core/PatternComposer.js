// PatternComposer.js
// Compositor de patrones JSON para EXO

export default class PatternComposer {
  constructor() {
    this.pattern = { tracks: [] };
  }

  load(json) {
    try {
      this.pattern = JSON.parse(json);
    } catch (err) {
      console.warn("Invalid JSON pattern", err);
    }
  }

  getPattern() {
    return this.pattern;
  }
}
