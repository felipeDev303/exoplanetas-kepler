// scripts/processPlanets.js
// Carga y normaliza un JSON de exoplanetas (data/exoplanets.json).
// Expone window.EXO_PLANETS para inspección en la consola.

async function loadAndProcess() {
  try {
    const res = await fetch("/data/exoplanets.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const planets = await res.json();

    // Helper: determinar si un registro raw indica que está "confirmado"
    function isConfirmed(obj) {
      if (!obj || typeof obj !== "object") return false;
      for (const k of Object.keys(obj)) {
        if (/disposition|status|flag/i.test(k)) {
          const v = obj[k];
          if (v == null) continue;
          const s = String(v).toLowerCase();
          if (s.includes("confir")) return true; // 'confirmed', 'CONFIRMED', etc.
        }
      }
      return false;
    }

    // Filtrar registros raw para quedarnos con los marcados como confirmados
    const confirmedRaw = planets.filter(isConfirmed);

    // Normalizar sólo los registros confirmados
    const cleaned = confirmedRaw
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

    console.log("Planetas totales en el JSON:", planets.length);
    console.log(
      "Registros marcados como confirmados (raw):",
      confirmedRaw.length
    );
    console.log("Planetas procesados y confirmados:", cleaned.length);
    console.table(cleaned.slice(0, 20));
    // Exponer para uso interactivo desde consola / otros scripts
    window.EXO_PLANETS = cleaned;
    if (window.EXO_PLANETS && window.EXO_PLANETS.length) {
      import("/scripts/visualizeThree.js")
        .then((m) => m.visualize())
        .catch((err) => console.warn("No se pudo iniciar visualizador:", err));
    }
    return cleaned;
  } catch (err) {
    console.error("Error cargando /data/exoplanets.json:", err);
    return [];
  }
}

// Ejecutar al cargar
loadAndProcess();

// =========================
// Utilidades de consulta
// =========================

function _ensureLoaded() {
  if (!window.EXO_PLANETS) {
    console.warn(
      "EXO_PLANETS no está cargado todavía. Ejecuta loadAndProcess() o recarga la página."
    );
    return false;
  }
  return true;
}

function searchByName(term) {
  if (!_ensureLoaded()) return [];
  const q = String(term).toLowerCase();
  return window.EXO_PLANETS.filter(
    (p) => p.name && p.name.toLowerCase().includes(q)
  );
}

function filterByRadiusRange(min = 0, max = Infinity) {
  if (!_ensureLoaded()) return [];
  return window.EXO_PLANETS.filter((p) => p.radius >= min && p.radius <= max);
}

function topNByRadius(n = 10) {
  if (!_ensureLoaded()) return [];
  return [...window.EXO_PLANETS]
    .sort((a, b) => b.radius - a.radius)
    .slice(0, n);
}

function findClosestRadius(value) {
  if (!_ensureLoaded()) return null;
  let closest = null;
  let bestDiff = Infinity;
  for (const p of window.EXO_PLANETS) {
    const d = Math.abs(p.radius - value);
    if (d < bestDiff) {
      bestDiff = d;
      closest = p;
    }
  }
  return closest;
}

function groupByPeriodRange(ranges = [10, 50, 200, 1000]) {
  // ranges: array de límites superiores (ascendente). Devuelve buckets: 0-10,10-50,...,1000+
  if (!_ensureLoaded()) return {};
  const sorted = [...ranges].sort((a, b) => a - b);
  const buckets = {};
  const names = [];
  let prev = 0;
  for (const r of sorted) {
    const key = `${prev}-${r}`;
    buckets[key] = [];
    names.push(key);
    prev = r;
  }
  buckets[`${prev}+`] = [];

  for (const p of window.EXO_PLANETS) {
    const per = Number(p.period);
    if (!Number.isFinite(per)) {
      buckets.unknown = buckets.unknown || [];
      buckets.unknown.push(p);
      continue;
    }
    let placed = false;
    prev = 0;
    for (const r of sorted) {
      if (per >= prev && per <= r) {
        buckets[`${prev}-${r}`].push(p);
        placed = true;
        break;
      }
      prev = r;
    }
    if (!placed) buckets[`${sorted[sorted.length - 1]}+`].push(p);
  }

  return buckets;
}

function statsSummary() {
  if (!_ensureLoaded()) return {};
  const n = window.EXO_PLANETS.length;
  const radii = window.EXO_PLANETS.map((p) => p.radius).filter(Number.isFinite);
  const periods = window.EXO_PLANETS.map((p) => p.period).filter(
    Number.isFinite
  );
  const sum = (arr) => arr.reduce((s, x) => s + x, 0);
  const avg = (arr) => (arr.length ? sum(arr) / arr.length : 0);
  return {
    count: n,
    radius: {
      min: Math.min(...radii),
      max: Math.max(...radii),
      avg: avg(radii),
    },
    period: {
      min: Math.min(...periods),
      max: Math.max(...periods),
      avg: avg(periods),
    },
  };
}

function sampleUsage() {
  console.log("EXO_UTILS.sampleUsage() — ejemplos rápidos:");
  console.log('Buscar por nombre: EXO_UTILS.searchByName("kepler-")');
  console.log("Top 10 por radio: EXO_UTILS.topNByRadius(10)");
  console.log(
    "Filtrar radio entre 1 y 2 R⊕: EXO_UTILS.filterByRadiusRange(1,2)"
  );
  console.log(
    "Agrupar por rango de periodo: EXO_UTILS.groupByPeriodRange([10,50,200])"
  );
  console.log("Resumen: EXO_UTILS.statsSummary()");
}

// Exponer utilidades globalmente
window.EXO_UTILS = {
  searchByName,
  filterByRadiusRange,
  topNByRadius,
  findClosestRadius,
  groupByPeriodRange,
  statsSummary,
  sampleUsage,
};

// Nota: ejecutar EXO_UTILS.sampleUsage() desde la consola para ver ejemplos.
