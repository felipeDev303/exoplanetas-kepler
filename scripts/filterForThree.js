const fs = require("fs");
const path = require("path");

const INPUT = path.join(process.cwd(), "data", "exoplanets.json");
const OUTPUT = path.join(process.cwd(), "data", "exoplanetsThree.json");

function getNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function extractPlanet(obj = {}, idx = 0) {
  // Nombre: pl_name (si no, intenta otros campos)
  const name =
    obj.pl_name ??
    obj.kepler_name ??
    obj.kep_name ??
    obj.name ??
    `unknown-${idx}`;
  // Radio: koi_prad (si no, pl_rade)
  const radius = getNumber(obj.koi_prad ?? obj.pl_rade ?? obj.koi?.prad);
  // Período orbital: pl_orbper o koi_period
  const period = getNumber(obj.pl_orbper ?? obj.koi_period ?? obj.koi?.per);
  return { name, radius, period };
}

function isConfirmed(item = {}) {
  for (const k of Object.keys(item)) {
    if (/disposition|status|flag/i.test(k)) {
      const v = item[k];
      if (v == null) continue;
      if (String(v).toLowerCase().includes("confir")) return true;
    }
  }
  if (item.pl_confirmed === true || item.confirmed === true) return true;
  const nested = item.koi ?? item;
  if (
    nested &&
    typeof nested.disposition === "string" &&
    /confir/i.test(nested.disposition)
  )
    return true;
  return false;
}

(function main() {
  try {
    const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
    if (!Array.isArray(raw))
      throw new Error("El JSON de entrada no es un array.");
    // Filtrar solo confirmados
    const confirmed = raw.filter(isConfirmed);
    // Extraer y filtrar planetas válidos
    const planets = confirmed
      .map(extractPlanet)
      .filter((p) => p.name && p.radius !== null && p.period !== null);
    // Ordenar por radio descendente
    planets.sort((a, b) => b.radius - a.radius);
    fs.writeFileSync(OUTPUT, JSON.stringify(planets, null, 2), "utf8");
    console.log(`Planetas confirmados y válidos: ${planets.length}`);
    console.log(`Guardado en: ${OUTPUT}`);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
