// scripts/processPlanets.js
// Carga y normaliza un JSON de exoplanetas (data/exoplanets.json).
// Expone window.EXO_PLANETS para inspección en la consola.

async function loadAndProcess() {
  try {
    const res = await fetch("/data/exoplanets.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const planets = await res.json();

    const cleaned = planets
      .map((planet) => ({
        name:
          planet.kepler_name ??
          planet.kep_name ??
          planet.pl_name ??
          planet.name ??
          "unknown",
        radius: Number(
          planet.koi?.prad ?? planet.koi_prad ?? planet.pl_rade ?? NaN
        ),
        period: Number(planet.koi?.per ?? planet.pl_orbper ?? NaN),
      }))
      .filter((p) => !Number.isNaN(p.radius));

    console.log("Planetas procesados:", cleaned.length);
    console.table(cleaned.slice(0, 20));
    // Exponer para uso interactivo desde consola / otros scripts
    window.EXO_PLANETS = cleaned;
    return cleaned;
  } catch (err) {
    console.error("Error cargando /data/exoplanets.json:", err);
    return [];
  }
}

// Ejecutar al cargar
loadAndProcess();
