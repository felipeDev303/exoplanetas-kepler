# Kepler Exoplanet Visualizer

Visualización interactiva de exoplanetas confirmados del archivo Kepler/NASA usando Three.js.

## Descripción

Este proyecto permite filtrar, procesar y visualizar exoplanetas confirmados utilizando datos públicos de la misión Kepler. El objetivo es facilitar la exploración visual de exoplanetas reales, mapeando parámetros físicos a una escena 3D interactiva.

- **Datos fuente:** NASA Kepler Exoplanet Archive (`data/exoplanets.json`)
- **Visualización:** Three.js (WebGL, sin dependencias de backend)
- **Procesamiento:** Scripts Node.js para filtrar y normalizar los datos

## Estructura de datos esperada

El archivo principal para la visualización es `data/exoplanetsThree.json`, que contiene solo planetas confirmados y los campos clave:

```json
[
  {
    "name": "Kepler-22 b",
    "radius": 2.4, // en radios terrestres (R⊕)
    "period": 289.9 // en días
  }
  // ...
]
```

## Pasos para preparar y visualizar los datos

### 1. Instalar Node.js (si no lo tienes)

Descarga desde [https://nodejs.org/](https://nodejs.org/)

### 2. Coloca el archivo de datos original

Descarga el dataset de exoplanetas Kepler y guárdalo como:

```text
data/exoplanets.json
```

### 3. Filtra y normaliza los datos para visualización

Ejecuta el script para generar `exoplanetsThree.json`:

```bash
node scripts/filterForThree.js
```

Esto creará `data/exoplanetsThree.json` solo con planetas confirmados y los campos requeridos.

### 4. Servir el proyecto en local

Puedes usar Live Server (VS Code) o un servidor estático:

**Con Live Server:**

- Haz clic derecho en `index.html` → "Open with Live Server"

**Con Python:**

```bash
python -m http.server 8000
```

**Con Node:**

```bash
npx http-server . -p 8000
```

Abre en tu navegador: [http://localhost:8000](http://localhost:8000)

### 5. Visualizar los exoplanetas

- Haz clic en el botón "Visualizar 3D" (si está en la interfaz)
- O ejecuta en la consola del navegador:

```js
import("/scripts/visualizeThree.js").then((m) => m.visualize());
```

## Troubleshooting

- Si ves errores de CORS o MIME-type, asegúrate de estar usando http:// y no file://
- Si no ves planetas, revisa que `data/exoplanetsThree.json` exista y tenga datos
- Si el visualizador no carga, revisa la consola del navegador para mensajes de error

## Próximos pasos recomendados

- Mejorar la interfaz de usuario y controles de la visualización
- Añadir filtros interactivos (por radio, período, etc.)
- Integrar datos adicionales (temperatura, masa, estrella anfitriona)
- Animar órbitas y permitir selección de planetas
- Exportar imágenes o videos de la visualización
- Documentar el pipeline de datos y automatizar la actualización

## Créditos y licencias

- Datos: NASA Exoplanet Archive
- Visualización: [Three.js](https://threejs.org/)
- Autoría y desarrollo: felipeDev303 y colaboradores

---

¿Dudas o sugerencias? Abre un issue o contacta al autor.

---

## Apéndice: Contexto y fundamentos

### ¿Qué son los Exoplanetas?

Son planetas que se encuentran fuera de nuestro sistema solar. Gracias a los avances tecnológicos, se han detectado miles de ellos y su información está disponible públicamente a través de interfaces como la API de la NASA.

### API de la NASA

La NASA ofrece un servidor con una interfaz que permite consultar y descargar información detallada (características, nombres, etc.) de exoplanetas en formato JSON. [Descargar datos](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&format=json)

### Método de Tránsito

Es el método más común y potente para detectar exoplanetas. Consiste en observar la disminución de la intensidad lumínica de una estrella cuando un planeta pasa por delante de ella (transita) desde nuestra perspectiva. Telescopios espaciales como Kepler, Spitzer o James Webb son cruciales para esta observación.

### Otros Métodos

Incluyen la velocidad radial (observando el "bamboleo" de la estrella por la gravedad de un planeta) y el microlensing.

### Zona Ricitos de Oro (Goldilocks Zone)

Muchos exoplanetas descubiertos se encuentran en esta zona, donde las condiciones podrían ser adecuadas para la existencia de agua líquida y, por tanto, vida. Se espera que en el futuro cercano se puedan detectar biomarcadores o incluso vida inteligente.

### Adquisición y Preparación de Datos de Exoplanetas

La información de la NASA es muy densa, por lo que es necesario un proceso de limpieza y estructuración.

- **Descarga de Datos:**
  - Accede a la API de la NASA ([descargar JSON](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&format=json)).
  - Descarga el archivo JSON con la información de los exoplanetas. Para una aplicación en vivo, te conectarías directamente a la API; sin embargo, para optimizar la velocidad y evitar cargas lentas, se recomienda descargar la información localmente y preprocesarla.
- **Limpieza y Reestructuración de Datos (Data Wrangling):** Utilizando JavaScript (con métodos como map, filter, sort y arrow functions de ES6):
  - Filtrado: Elimina aquellos planetas donde el radio no sea conocido (valores nulos en el campo pl_rade). [Prefiltering tables](https://exoplanetarchive.ipac.caltech.edu/docs/prefiltering_tables.html)
  - Mapeo: Selecciona solo los campos de interés, como el nombre del planeta (pl_name) y su radio relativo a la Tierra (pl_rade). Esto reduce la cantidad de información con la que trabajar.
  - Ordenación: Ordena los planetas por su radio (pl_rade) de mayor a menor. Esto es útil para seleccionar muestras representativas.
- **Selección de Muestras:** Para la visualización, selecciona un subconjunto de planetas (por ejemplo, 5 u 8) que incluyan los más grandes, los más pequeños y algunos intermedios para mostrar variabilidad.
