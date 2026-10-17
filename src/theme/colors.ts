export const colors = {
  // Backgrounds
  backgroundRoot: "#030a17",
  backgroundDark: "#171717",
  navyDeep: "#0a1628", // background base
  navyPanel: "#0a1628", // card / panel surface
  navyPanelAlt: "#1B2E52", // secondary surface (inputs)
  surfaceDark: "#0f1e35",

  // Accents & Signals
  crimson: "#8b1a1a", // signal red — primary accent
  crimsonDeep: "#8b1a1a", // shadow end of red gradient
  signalRed: "#dc2626",
  signalRedBadge: "#5a0e0e",
  brass: "#D6A75C", // brass rail-fitting gold — secondary accent

  // Text & Content
  ivory: "#F3EFE6", // primary text on dark
  slate: "#8A97B5", // muted secondary text
  textMuted: "#a3a3a3",
  blueLight: "#93c5fd",
  blueAccent: "#bfdbfe",

  // Statuses
  liveGreen: "#4ade80",
  liveGreenBg: "rgba(20, 83, 45, 0.2)",
  liveGreenBorder: "rgba(34, 197, 94, 0.25)",
  liveYellow: "#facc15",

  // Borders & Dividers
  borderNavy: "#1e3a5f",
  borderDark: "#262626",
  hairline: "rgba(214,167,92,0.18)", // brass hairline divider
  dividerLight: "rgba(255, 255, 255, 0.05)",
} as const;

export type ColorTheme = typeof colors;