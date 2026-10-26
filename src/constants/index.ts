export const APP_CONFIG = {
  appName: "Rail Tracker",
  appSubtitle: "ON TRACK · ON TIME",
  version: "1.0.0",
  defaultPlatform: 4,
  defaultPollIntervalMs: 15000,
} as const;

export const TRAIN_FILTER_CATEGORIES = ["ALL", "FAST", "SLOW"] as const;
export type TrainFilterCategory = (typeof TRAIN_FILTER_CATEGORIES)[number];

export const APP_TABS = [
  { id: "search", label: "Search\nTrain", icon: "train", lib: "MCI" },
  { id: "schedule", label: "Train\nSchedule", icon: "calendar-outline", lib: "ION" },
  { id: "live", label: "Live\nStation", icon: "timer-outline", lib: "ION" },
  { id: "map", label: "Map", icon: "map-outline", lib: "ION" },
] as const;

export const RECENT_SEARCHES_MOCK = [
  { id: "1", from: "Virar", to: "Dahanu", date: "05 Jul 2026" },
  { id: "2", from: "Virar", to: "Boisar", date: "04 Jul 2026" },
  { id: "3", from: "Virar", to: "Palghar", date: "03 Jul 2026" },
];
