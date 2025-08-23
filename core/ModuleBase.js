// ModuleBase.js
// Clase base para módulos de EXO

import EventBus from "./EventBus.js";

export class ModuleBase {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.isActive = false;
    this.eventBus = EventBus;
  }

  init() {
    // Implementar en cada módulo
  }

  activate() {
    this.isActive = true;
    this.eventBus.emit("module:activated", { module: this.name });
  }

  deactivate() {
    this.isActive = false;
    this.eventBus.emit("module:deactivated", { module: this.name });
  }

  destroy() {
    this.deactivate();
    // Limpieza del módulo
  }

  receiveData(data) {
    // Implementar en cada módulo
  }

  sendData(data) {
    this.eventBus.emit(`${this.name}:data`, data);
  }
}
