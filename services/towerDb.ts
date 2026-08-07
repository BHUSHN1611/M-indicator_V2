import * as SQLite from "expo-sqlite";

const DB_NAME = "tower-tracking.db";

export interface TowerRow {
  eci: string;
  latitude: number;
  longitude: number;
  tac: number | null;
  mcc: number | null;
  mnc: number | null;
  station_name: string | null;
  route_segment: string | null;
  confidence: number | null;
}

const DEFAULT_TOWER_SEED = [
  {
    eci: "3252469762",
    latitude: 19.955,
    longitude: 72.825,
    tac: 12345,
    mcc: 404,
    mnc: 87,
    stationName: "Virar",
    routeSegment: "Virar – Palghar",
    confidence: 1.0,
  },
  {
    eci: "3252469763",
    latitude: 19.97,
    longitude: 72.83,
    tac: 12346,
    mcc: 404,
    mnc: 87,
    stationName: "Palghar",
    routeSegment: "Palghar – Dahanu",
    confidence: 1.0,
  },
];

export const openTowerDb = () => SQLite.openDatabaseSync(DB_NAME);

const ensureSeedTowers = (db: SQLite.SQLiteDatabase) => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS towers (
      eci TEXT PRIMARY KEY,
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

  const existingCount = db.getFirstSync(
    "SELECT COUNT(*) AS count FROM towers",
  ) as { count: number } | undefined;

  if ((existingCount?.count ?? 0) === 0) {
    DEFAULT_TOWER_SEED.forEach((tower) => insertTower(db, tower));
  }

  return db;
};

export const initTowerDb = () => {
  const db = openTowerDb();
  return ensureSeedTowers(db);
};

export const clearTowers = (db: SQLite.SQLiteDatabase) => {
  db.execSync("DELETE FROM towers");
};

export const insertTower = (
  db: SQLite.SQLiteDatabase,
  row: {
    eci: string;
    latitude: number;
    longitude: number;
    tac?: number | string;
    mcc?: number | string;
    mnc?: number | string;
    stationName?: string;
    routeSegment?: string;
    confidence?: number;
  },
) => {
  db.runSync(
    `
      INSERT OR REPLACE INTO towers (
        eci, latitude, longitude, tac, mcc, mnc, station_name, route_segment, confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      row.eci,
      row.latitude,
      row.longitude,
      row.tac ?? null,
      row.mcc ?? null,
      row.mnc ?? null,
      row.stationName ?? null,
      row.routeSegment ?? null,
      row.confidence ?? 1.0,
    ],
  );
};

export const getAllTowers = (db: SQLite.SQLiteDatabase) => {
  return db.getAllSync("SELECT * FROM towers ORDER BY eci");
};

export const getTowerByEci = (db: SQLite.SQLiteDatabase, eci: string) => {
  return db.getFirstSync("SELECT * FROM towers WHERE eci = ?", [eci]);
};

export const lookupTowerByCellId = (
  db: SQLite.SQLiteDatabase,
  cellId: string | number | null | undefined,
): TowerRow | null => {
  if (cellId === null || cellId === undefined || cellId === "") {
    return null;
  }

  const normalized = String(cellId).trim();
  return (
    (db.getFirstSync("SELECT * FROM towers WHERE eci = ? LIMIT 1", [
      normalized,
    ]) as TowerRow | null) ?? null
  );
};
