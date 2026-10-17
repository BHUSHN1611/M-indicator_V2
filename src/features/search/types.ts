export interface RecentSearchItem {
  id: string;
  from: string;
  to: string;
  date: string;
}

export interface NavTabItem {
  id: string;
  label: string;
  icon: any;
  lib: "MCI" | "ION";
}
