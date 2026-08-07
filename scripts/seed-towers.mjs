import * as SQLite from "expo-sqlite";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const db = SQLite.openDatabaseSync("tower-tracking.db");

const initDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS towers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eci TEXT UNIQUE,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      tac REAL,
      mcc REAL,
      mnc REAL,
      station_name TEXT,
      route_segment TEXT,
      confidence REAL DEFAULT 1.0
    );
  `);
};

const clearDb = () => {
  db.execSync("DELETE FROM towers");
};

const insertTower = (row) => {
  const [eci, latitude, longitude, tac, mcc, mnc] = row.split(",");
  if (!eci || !latitude || !longitude) return;
  db.runSync(
    `INSERT OR REPLACE INTO towers (eci, latitude, longitude, tac, mcc, mnc, station_name, route_segment, confidence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eci.trim(),
      Number(latitude),
      Number(longitude),
      Number(tac),
      Number(mcc),
      Number(mnc),
      "Virar-Palghar Corridor",
      "Virar -> Palghar",
      1.0,
    ],
  );
};

const main = async () => {
  initDb();
  clearDb();

  const csvPath = path.join(rootDir, "assets", "virar-palghar-towers (1).csv");
  const csvText = await readFile(csvPath, "utf8");
  const rows = csvText.trim().split(/\r?\n/).slice(1).filter(Boolean);

  rows.forEach(insertTower);
  const count = db.getFirstSync("SELECT COUNT(*) AS count FROM towers");
  console.log("Seeded tower rows:", count?.count);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
