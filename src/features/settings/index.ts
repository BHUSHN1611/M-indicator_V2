export interface UserSettings {
  notificationsEnabled: boolean;
  theme: "dark" | "light" | "system";
  defaultLine: string;
}

export const defaultSettings: UserSettings = {
  notificationsEnabled: true,
  theme: "dark",
  defaultLine: "WESTERN",
};
