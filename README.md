# EXO: Visualizador Audio‑Visual de Exoplanetas (arquitectura)

Este repositorio contiene EXO, un módulo de una librería de patrones audio‑visuales basada en la web que integra datos del archivo Kepler (NASA) con entrada MIDI en tiempo real para generar visualizaciones dinámicas.

## Resumen rápido

- Arquitectura modular orientada a módulos independientes (core, data, input, visual, scenes, audio, utils).
- Comunicación interna basada en un EventBus central (pub/sub).
- Clase base `ModuleBase` para homogeneizar ciclo de vida, métricas y suscripciones.
- El proyecto incluye un demo `index.html` con un `ModuleManager` y varios módulos mock para pruebas.

## Estructura recomendada de módulos

1. Core (sistema central)

- `core/EventBus.js` — Event bus singleton (subscribe / emit / unsubscribe).
- `core/ModuleBase.js` — Clase base para todos los módulos (init / activate / deactivate / send/receive).
- `core/ModuleManager.js` — Registro, carga y ciclo de vida de módulos.
- `core/PatternComposer.js` — Compositor de patrones a partir de JSON.

2. Data (módulos de datos)

- `data/KeplerAPI.js` — Cliente para Kepler Exoplanet Archive.
- `data/DataProcessor.js` — Normalización y filtrado.
- `data/DataCache.js` — Caché local simple.
- `data/MockDataGenerator.js` — Datos simulados para desarrollo offline.

3. Input (módulos de entrada)

- `input/HandGestureInput.js` — MediaPipe Hands (gestos).
- `input/MIDIInput.js` — WebMIDI / webmidi para Ableton.
- `input/OSCInput.js` — Open Sound Control.
- `input/WebSocketInput.js` — Control en tiempo real.
- `input/KeyboardInput.js` — Controles por teclado.

4. Visual (renderers)

- `visual/ThreeJSRenderer.js` — Three.js renderer.
- `visual/P5JSRenderer.js` — Integración P5.js.
- `visual/CanvasRenderer.js` — Canvas 2D.
- `visual/D3JSRenderer.js` — Visualizaciones D3.
- `visual/shaders/*` — Shaders GLSL reutilizables.

5. Scenes (escenas)

- `scenes/OrbitalSystem.js` — Sistema orbital.
- `scenes/NetworkMap.js` — Mapa de red.
- `scenes/ParticleField.js` — Campo de partículas.
- `scenes/DubSpace.js` — Estética dub techno.
- `scenes/CustomScene.js` — Base para escenas personalizadas.

6. Audio

- `audio/WebAudioEngine.js` — Motor WebAudio.
- `audio/ToneJSIntegration.js` — Adapter a Tone.js.
- `audio/StrudelBridge.js` — Puente opcional.
- `audio/effects/*` — Efectos (delay, filter, reverb).

7. Utils

- `utils/MathUtils.js`, `ColorPalettes.js`, `GeometryHelpers.js`, `Performance.js`, `Presets.js`

## Patrón de comunicación: EventBus

- El `EventBus` actúa como bus de mensajes pub/sub. Esto desacopla productores y consumidores y facilita: pruebas, simulaciones y hot‑swap de módulos.
- Funcionalidades clave del bus incluido:
  - subscribe(eventType, callback, subscriberId?) → devuelve subscriptionId
  - emit(eventType, data) → propaga evento a subscribers
  - unsubscribe(eventType, subscriptionId)
  - unsubscribeAll(subscriberId)
  - métricas & historial (events/sec, tiempos de proceso, eventos recientes)

Ejemplos de eventos comunes:

- gesture:detected
- data:exoplanets_loaded
- midi:note
- render:frame

## Clase base de módulos: ModuleBase

Propósito: unificar ciclo de vida y API común para todos los módulos.

Principales métodos:

- init() / onInit() — inicialización asíncrona.
- activate() / onActivate() — activar comportamiento en tiempo real.
- deactivate() / onDeactivate() — pausar / liberar recursos.
- destroy() — cleanup completo.
- setEventBus(bus) — asignar el EventBus global.
- subscribe(event, cb) — wrapper que registra suscripciones con métricas.
- emit(event, data) — wrapper para `EventBus.emit`.

Métricas internas: tiempos de inicialización, contador de eventos procesados, errores.

## Flujo de datos (alto nivel)

1. Input → Processing → Output

- [Hand Gestures] → [Gesture Processor] → [Parameter Mapping] → [Visual Engine]
- [Kepler Data] → [Data Processor] → [Planet Selection] → [Scene Manager]
- [MIDI Input] → [MIDI Processor] → [Parameter Control] → [Audio Engine]

2. Ejemplo de flujo de eventos

- gesture:detected → parameter:updated → visual:refresh
- data:exoplanets_loaded → scene:updated → render:frame
- audio:triggered → visual:sync → effect:applied

## Configuración del compositor (pattern JSON)

Ejemplo (usa el `PatternComposer` para cargar esto):

```json
{
  "pattern_id": "exo_dub_space_v1",
  "name": "Exoplanet Dub Space",
  "modules": { ... },
  "parameters": { ... }
}
```

(Puedes copiar el ejemplo completo desde la documentación del proyecto — incluye mapeos de gestos, parámetros y presets.)

## Demo rápido (index.html)

- `index.html` incluido en el repositorio es un demo de administración modular: contiene un `ModuleManager`, `EventBus` y módulos mock (HandGesture, KeplerAPI, ThreeJSRenderer, MIDI, Strudel, Audio). Está listo para pruebas locales.

Para probarlo localmente (desde filesystem o servidor local):

1. Abrir `index.html` en el navegador (recomendado: servidor local para evitar CORS si se usan fetch reales).
2. En el panel, seleccionar un módulo en "Load Module" y pulsar "Load Module".
3. Activar/desactivar módulos y observar eventos en "Event Bus Monitor".

Notas: para usar MediaPipe, WebMIDI o llamadas reales a Kepler API debes servir la carpeta por HTTP(S) (p. ej. `npx http-server .` o `python -m http.server`).

## Cómo añadir un módulo real

1. Crear archivo en la carpeta adecuada (`input/`, `visual/`, etc.).
2. Extender `core/ModuleBase.js` y sobreescribir `onInit`, `onActivate`, `onDeactivate` y `onDestroy` según necesites.
3. Registrar el tipo en `core/ModuleManager.js` (o usar el registro dinámico en tiempo de ejecución).
4. Publicar eventos relevantes con `this.emit(eventType, data)` y suscribirte con `this.subscribe(eventType, cb)`.

## Tests y calidad

- Recomendado: añadir tests unitarios para `data/DataProcessor.js` y `data/DataCache.js`.
- Añadir linter y scripts en `package.json` si el proyecto crece.

## Siguientes pasos recomendados

1. Convertir `input/MIDIInput.js` y `data/KeplerAPI.js` para que extiendan `ModuleBase` y usen `EventBus`.
2. Implementar `scenes/OrbitalSystem.js` que escuche `data:exoplanets_loaded` y renderice usando `visual/ThreeJSRenderer.js`.
3. Añadir presets y mapeos MIDI por defecto en `utils/Presets.js`.

## Créditos

- Datos: NASA Exoplanet Archive (Kepler).
- Herramientas: Three.js, MediaPipe, Web MIDI API.

---

Revisa `index.html` para ver el demo operativo y usa las clases en `core/` como plantilla para tus módulos.
