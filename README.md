# Kepler Exoplanet

## Source

URL=https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative

## Instructivo: Visualización de Exoplanetas con la API de la NASA y ThreeJS

Este instructivo te guiará a través del proceso de crear una visualización interactiva en 3D de exoplanetas, utilizando datos reales de la NASA y la librería ThreeJS de JavaScript. El objetivo es conectar disciplinas como la astronomía, la informática y las matemáticas para comprender mejor nuestro lugar en el universo.

### 1. Introducción a Exoplanetas y Métodos de Detección

• ¿Qué son los Exoplanetas? Son planetas que se encuentran fuera de nuestro sistema solar. Gracias a los avances tecnológicos, se han detectado miles de ellos y su información está disponible públicamente a través de interfaces como la API de la NASA.
• API de la NASA: La NASA ofrece un servidor con una interfaz que permite consultar y descargar información detallada (características, nombres, etc.) de exoplanetas en formato JSON.
• Método de Tránsito: Es el método más común y potente para detectar exoplanetas. Consiste en observar la disminución de la intensidad lumínica de una estrella cuando un planeta pasa por delante de ella (transita) desde nuestra perspectiva. Telescopios espaciales como Kepler, Spitzer o James Webb son cruciales para esta observación.
• Otros Métodos: Incluyen la velocidad radial (observando el "bamboleo" de la estrella por la gravedad de un planeta) y el microlensing.
• Zona Ricitos de Oro (Goldilocks Zone): Muchos exoplanetas descubiertos se encuentran en esta zona, donde las condiciones podrían ser adecuadas para la existencia de agua líquida y, por tanto, vida. Se espera que en el futuro cercano se puedan detectar biomarcadores o incluso vida inteligente.

### 2. Adquisición y Preparación de Datos de Exoplanetas

La información de la NASA es muy densa, por lo que es necesario un proceso de limpieza y estructuración.
• Descarga de Datos:
◦ Accede a la API de la NASA ([Link para descargar](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&format=json)).
◦ Descarga el archivo JSON con la información de los exoplanetas. Para una aplicación en vivo, te conectarías directamente a la API; sin embargo, para optimizar la velocidad y evitar cargas lentas, se recomienda descargar la información localmente y preprocesarla.
• Limpieza y Reestructuración de Datos (Data Wrangling): Utilizando JavaScript (con métodos como map, filter, sort y arrow functions de ES6):
◦ Filtrado: Elimina aquellos planetas donde el radio no sea conocido (valores nulos en el campo pl_rade). [prefiltering_tables](https://exoplanetarchive.ipac.caltech.edu/docs/prefiltering_tables.html)
◦ Mapeo: Selecciona solo los campos de interés, como el nombre del planeta (pl_name) y su radio relativo a la Tierra (pl_rade). Esto reduce la cantidad de información con la que trabajar.
◦ Ordenación: Ordena los planetas por su radio (pl_rade) de mayor a menor. Esto es útil para seleccionar muestras representativas.
• Selección de Muestras: Para la visualización, selecciona un subconjunto de planetas (por ejemplo, 5 u 8) que incluyan los más grandes, los más pequeños y algunos intermedios para mostrar variabilidad
