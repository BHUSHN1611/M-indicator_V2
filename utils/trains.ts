import { ALL_DN_TRAINS } from "@/constants/Trainstops[Virar-dahahu]"; 
export interface Stop {
  time: string | null;
  departure?: string | null;
  name: string;
  platform?: string;
  major?: boolean;
  endpoint?: boolean;
  highlighted?: boolean;
}

export interface TrainData {
  train_no: string;
  route: string;
  train_type: string;
  cars: number | string;
  stops: Stop[];
}

export type TrainStatus = "before" | "running" | "done";

export interface TrainState {
  status: TrainStatus;
  currentIdx: number;
  nextIdx: number;
  progress: number;
}

export function getTrainByNumber(trainNo: string): TrainData | undefined {
  return Object.values(ALL_DN_TRAINS).find((t) => t.train_no === trainNo);
}

/** "HH:MM" → minutes since midnight, or null for a stop the train doesn't call at. */
export function toMins(t: string | null): number | null {
  if (t === null) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function realNowMins(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60;
}

export function interpolateStopMins(stops: Stop[]): number[] {
  const raw: (number | null)[] = stops.map((s) => toMins(s.time));
  const filled = [...raw];

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

    const prevVal = prevIdx >= 0 ? (filled[prevIdx] as number) : null;
    const nextVal = nextIdx < filled.length ? (filled[nextIdx] as number) : null;

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

  return filled.map((v) => v as number);
}

export function getTrainState(nowMins: number, stopMins: number[]): TrainState {
  const first = stopMins[0];
  const last = stopMins[stopMins.length - 1];
  if (nowMins < first) return { status: "before", currentIdx: -1, nextIdx: 0, progress: 0 };
  if (nowMins >= last)
    return { status: "done", currentIdx: stopMins.length - 1, nextIdx: -1, progress: 100 };
  for (let i = 0; i < stopMins.length - 1; i++) {
    if (nowMins >= stopMins[i] && nowMins < stopMins[i + 1]) {
      const progress = ((nowMins - first) / (last - first)) * 100;
      return { status: "running", currentIdx: i, nextIdx: i + 1, progress };
    }
  }
  return { status: "done", currentIdx: stopMins.length - 1, nextIdx: -1, progress: 100 };
}


export function getLiveStatus(stops: Stop[]): TrainState {
  return getTrainState(realNowMins(), interpolateStopMins(stops));
}