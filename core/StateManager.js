// StateManager.js
// Estado global simple para EXO

export default class StateManager {
  constructor(initial = {}) {
    this.state = initial;
    this.listeners = [];
  }

  set(key, value) {
    this.state[key] = value;
    this._notify(key, value);
  }

  get(key) {
    return this.state[key];
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify(key, value) {
    for (const fn of this.listeners) fn(key, value);
  }
}
