import { readFile } from "fs/promises";
import path from "path";
import { clearTowers, initTowerDb, insertTower } from "./towerDb";

export const seedTowerDb = async () => {
  const db = initTowerDb();
  clearTowers(db);

  const csvPath = path.join(
    process.cwd(),
    "assets",
    "virar-palghar-towers (1).csv",
  );
  const csvText = await readFile(csvPath, "utf8");

  const rows = csvText.trim().split(/\r?\n/).slice(1).filter(Boolean);

  for (const row of rows) {
    const [eci, latitude, longitude, tac, mcc, mnc] = row.split(",");

    if (!eci || !latitude || !longitude) continue;

    insertTower(db, {
      eci: eci.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      tac: Number(tac),
      mcc: Number(mcc),
      mnc: Number(mnc),
      stationName: "Virar-Palghar Corridor",
      routeSegment: "Virar -> Palghar",
      confidence: 1.0,
    });
  }

  return db;
};
