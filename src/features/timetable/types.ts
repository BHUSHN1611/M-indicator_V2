export type FilterCategory = 'ALL' | 'FAST' | 'SLOW';

export interface TrainListItemData {
  departure_time: string;
  departure_period: string;
  destination: string;
  train_type?: string;
  train_no: string;
  route: string;
  platform: string | number;
}
