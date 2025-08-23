// WebSocketInput.js
// Conexión WebSocket para mensajes de control en tiempo real

export default class WebSocketInput {
  constructor(url) {
    this.url = url;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (e) => {
      if (this.onMessage) this.onMessage(JSON.parse(e.data));
    };
  }

  onMessage(fn) {
    this.onMessage = fn;
  }
}
