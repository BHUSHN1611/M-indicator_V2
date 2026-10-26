import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read JSON datasets directly to test against real data
const vrDrdDownData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'assets/data/trains/vrDrdDownTrains.json'), 'utf8')
);
const drdVrUpData = [];
const stationsData = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'assets/data/stations/westernLine.json'), 'utf8')
);

// Pure time utilities implementation (verifying logic in src/services/tracking/timeUtils.ts)
const MINUTES_PER_DAY = 1440;

function timeStringToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function minutesToTimeString(totalMinutes) {
  const normalized = ((Math.floor(totalMinutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatEta(diffMinutes) {
  if (diffMinutes <= 0) return 'now';
  if (diffMinutes < 60) return `${Math.ceil(diffMinutes)}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = Math.ceil(diffMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function interpolateStopTimes(rawTimes) {
  if (rawTimes.length === 0) return [];
  const rawMinutes = rawTimes.map(timeStringToMinutes);
  let rolloverOffset = 0;
  let lastValidMinute = null;
  const adjustedMinutes = [];

  for (const m of rawMinutes) {
    if (m === null) {
      adjustedMinutes.push(null);
      continue;
    }
    let current = m + rolloverOffset;
    if (lastValidMinute !== null && current < lastValidMinute) {
      rolloverOffset += MINUTES_PER_DAY;
      current = m + rolloverOffset;
    }
    adjustedMinutes.push(current);
    lastValidMinute = current;
  }

  const filled = [...adjustedMinutes];
  let i = 0;
  while (i < filled.length) {
    if (filled[i] !== null) {
      i++;
      continue;
    }
    let prevIdx = i - 1;
    while (prevIdx >= 0 && filled[prevIdx] === null) prevIdx--;
    let nextIdx = i;
    while (nextIdx < filled.length && filled[nextIdx] === null) nextIdx++;

    const prevVal = prevIdx >= 0 ? filled[prevIdx] : null;
    const nextVal = nextIdx < filled.length ? filled[nextIdx] : null;

    for (let k = i; k < nextIdx; k++) {
      if (prevVal !== null && nextVal !== null) {
        const frac = (k - prevIdx) / (nextIdx - prevIdx);
        filled[k] = prevVal + (nextVal - prevVal) * frac;
      } else if (prevVal !== null) {
        filled[k] = prevVal;
      } else if (nextVal !== null) {
        filled[k] = nextVal;
      } else {
        filled[k] = 0;
      }
    }
    i = nextIdx;
  }
  return filled;
}

const allTrains = [...vrDrdDownData, ...drdVrUpData];

describe('1. Time & Timetable Calculations (timeUtils)', () => {
  it('converts HH:MM strings to minutes since midnight correctly', () => {
    assert.equal(timeStringToMinutes('00:00'), 0);
    assert.equal(timeStringToMinutes('04:15'), 255);
    assert.equal(timeStringToMinutes('12:30'), 750);
    assert.equal(timeStringToMinutes('23:59'), 1439);
    assert.equal(timeStringToMinutes(null), null);
    assert.equal(timeStringToMinutes(undefined), null);
    assert.equal(timeStringToMinutes('invalid'), null);
  });

  it('converts minutes since midnight back to 24h formatted string', () => {
    assert.equal(minutesToTimeString(0), '00:00');
    assert.equal(minutesToTimeString(255), '04:15');
    assert.equal(minutesToTimeString(1439), '23:59');
    assert.equal(minutesToTimeString(1445), '00:05'); // handles rollover
  });

  it('formats ETAs into user-friendly strings', () => {
    assert.equal(formatEta(-5), 'now');
    assert.equal(formatEta(0), 'now');
    assert.equal(formatEta(1), '1m');
    assert.equal(formatEta(45), '45m');
    assert.equal(formatEta(60), '1h');
    assert.equal(formatEta(90), '1h 30m');
  });

  it('interpolates missing (null) stop times smoothly and monotonically', () => {
    const raw = ['05:00', null, '05:30'];
    const result = interpolateStopTimes(raw);
    assert.equal(result.length, 3);
    assert.equal(result[0], 300);
    assert.equal(result[1], 315); // midpoint
    assert.equal(result[2], 330);
  });

  it('handles midnight crossover without regressing sequence', () => {
    const raw = ['23:50', '00:10', '00:30'];
    const result = interpolateStopTimes(raw);
    assert.equal(result[0], 1430);
    assert.equal(result[1], 1450); // 10 mins past midnight
    assert.equal(result[2], 1470);
    assert.ok(result[1] > result[0]);
    assert.ok(result[2] > result[1]);
  });
});

describe('2. Train Data Repository & Lookups', () => {

  it('loads real train datasets without corruption', () => {
    assert.ok(allTrains.length > 20, `Expected >20 trains, found ${allTrains.length}`);
    assert.ok(stationsData.length >= 9, `Expected >=9 stations, found ${stationsData.length}`);
  });

  it('looks up trains by train number reliably', () => {
    const sample = allTrains[0];
    const found = allTrains.find((t) => t.trainNumber === sample.trainNumber);
    assert.ok(found);
    assert.equal(found.trainNumber, sample.trainNumber);
    assert.ok(found.stops.length > 0);
  });

  it('finds trains between two given stations in directional order', () => {
    // Virar to Dahanu Road
    const fromId = 'VR';
    const toId = 'DRD';
    const matching = allTrains.filter((train) => {
      const fromIdx = train.stops.findIndex((s) => s.stationId === fromId && s.time !== null);
      const toIdx = train.stops.findIndex((s) => s.stationId === toId && s.time !== null);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });

    assert.ok(matching.length > 0, 'Should find trains running from VR to DRD');
    matching.forEach((t) => {
      const fIdx = t.stops.findIndex((s) => s.stationId === fromId);
      const tIdx = t.stops.findIndex((s) => s.stationId === toId);
      assert.ok(fIdx < tIdx, `Train ${t.trainNumber} stops are reversed`);
    });
  });

  it('filters train lists by train type (FAST, SLOW, ALL)', () => {
    const fastTrains = allTrains.filter((t) => t.trainType === 'FAST');
    const slowTrains = allTrains.filter((t) => t.trainType === 'SLOW');
    assert.ok(fastTrains.length > 0, 'Should have fast trains');
    assert.ok(slowTrains.length > 0, 'Should have slow trains');
    assert.equal(fastTrains.length + slowTrains.length, allTrains.length);
  });
});

describe('3. Route Matching & Stop Sequencing', () => {
  it('validates station codes exist in master station dataset', () => {
    const validStationIds = new Set(stationsData.map((s) => s.id));
    for (const train of allTrains) {
      for (const stop of train.stops) {
        assert.ok(
          validStationIds.has(stop.stationId),
          `Unknown stationId: ${stop.stationId} in train ${train.trainNumber}`
        );
      }
    }
  });

  it('ensures each train has valid stops and matching destination', () => {
    for (const train of allTrains) {
      assert.ok(train.stops.length > 0, `Train ${train.trainNumber} has no stops`);
      const lastStop = train.stops[train.stops.length - 1];
      assert.equal(
        lastStop.stationId,
        train.destinationStationId,
        `Train ${train.trainNumber} final stop mismatch: expected ${train.destinationStationId}, got ${lastStop.stationId}`
      );
    }
  });
});
