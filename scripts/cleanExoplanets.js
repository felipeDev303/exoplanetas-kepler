const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const INPUT = path.join(process.cwd(), "data", "exoplanets.json");
    const OUTPUT = path.join(process.cwd(), "data", "exoplanetsFiltered.json");
    console.log("Reading", INPUT);
    const rawText = fs.readFileSync(INPUT, "utf8");
    const raw = JSON.parse(rawText);
    if (!Array.isArray(raw)) {
      console.error("Input not array");
      process.exit(1);
    }
    console.log("Total records:", raw.length);
    function isConfirmed(item) {
      if (!item || typeof item !== "object") return false;
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
    const confirmedRaw = raw.filter(isConfirmed);
    console.log("Confirmed raw:", confirmedRaw.length);
    const cleaned = confirmedRaw
      .map((p, i) => ({
        name:
          p.kepler_name ?? p.kep_name ?? p.pl_name ?? p.name ?? `unknown-${i}`,
        radius: Number(p.koi?.prad ?? p.koi_prad ?? p.pl_rade ?? NaN),
        period: Number(p.koi?.per ?? p.pl_orbper ?? NaN),
      }))
      .filter((p) => !Number.isNaN(p.radius));
    console.log("Confirmed normalized with radius:", cleaned.length);
    fs.writeFileSync(OUTPUT, JSON.stringify(cleaned, null, 2), "utf8");
    console.log("Wrote", OUTPUT);
  } catch (err) {
    console.error("Error in temp run:", err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
