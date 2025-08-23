// ModuleManager.js
// Gestor simple de módulos para EXO

export default class ModuleManager {
  constructor() {
    this.modules = new Map();
  }

  register(name, instance) {
    this.modules.set(name, instance);
  }

  get(name) {
    return this.modules.get(name);
  }

  unregister(name) {
    this.modules.delete(name);
  }
}
