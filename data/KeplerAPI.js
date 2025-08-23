// KeplerAPI.js
// Cliente mínimo para consultar el Kepler Exoplanet Archive (NASA)

const BASE = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

export default class KeplerAPI {
  static async fetch(query) {
    const q = encodeURIComponent(query);
    const url = `${BASE}?query=${q}&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Kepler API ${res.status}`);
    return res.json();
  }

  static async fetchKeplerPlanets(limit = 100) {
    const query = `select pl_name,pl_orbper,pl_rade from ps where pl_orbper is not null and pl_rade is not null limit ${limit}`;
    return KeplerAPI.fetch(query);
  }
}
