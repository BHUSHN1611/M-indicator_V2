export const strings = {
  common: {
    appName: "RAIL TRACKER",
    eyebrow: "ON TRACK · ON TIME",
    findTrains: "Find Trains",
    pf: "PF",
    live: "LIVE",
    trainSchedule: "Train schedule",
    emptyFilterResults: "No trains found for selected filter.",
    trainsFound: "trains found",
    lastSearched: "Last searched",
    errorTrainNotFound: "Train not found",
    errorCheckTrainNumber: "Check the train number and try again.",
  },
  greetings: {
    morning: "Good morning, Commuter",
    afternoon: "Good afternoon, Commuter",
    evening: "Good evening, Commuter",
    default: "Welcome, Commuter",
  },
  search: {
    fromLabel: "FROM",
    toLabel: "TO",
    fromPlaceholder: "Enter origin station…",
    toPlaceholder: "Enter destination station…",
    recentSearchesTitle: "QUICK RECENT SEARCHES",
  },
  gps: {
    getGpsLocation: "Get GPS Location",
    latitude: "Latitude",
    longitude: "Longitude",
    accuracy: "Accuracy",
    speed: "Speed",
    heading: "Heading",
    notAvailable: "N/A",
    unableToGetLocation: "Unable to get location",
  },
} as const;

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return strings.greetings.morning;
  if (hour >= 12 && hour < 17) return strings.greetings.afternoon;
  if (hour >= 17 && hour < 21) return strings.greetings.evening;
  return strings.greetings.default;
}
