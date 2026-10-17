import { Train, TrainType } from '../../models/train';
import { VR_DRD_DOWN_TRAINS } from './vrDrdDownTrains';
import { DRD_VR_UP_TRAINS } from './drdVrUpTrains';

export const ALL_TRAINS: Train[] = [
  ...VR_DRD_DOWN_TRAINS,
  ...DRD_VR_UP_TRAINS,
];

// O(1) Map by train number
const trainsByNumber = new Map<string, Train>();
for (const train of ALL_TRAINS) {
  trainsByNumber.set(train.trainNumber, train);
}

export const trainRepository = {
  /** Return all trains in the system */
  getAll(): Train[] {
    return ALL_TRAINS;
  },

  /** Look up train by train number */
  getByNumber(trainNumber: string): Train | undefined {
    return trainsByNumber.get(trainNumber);
  },

  /** Look up all trains assigned to a specific route ID */
  getByRoute(routeId: string): Train[] {
    return ALL_TRAINS.filter((t) => t.routeId === routeId);
  },

  /**
   * Find trains that stop at fromStationId and later at toStationId
   */
  findTrainsBetween(fromStationId: string, toStationId: string): Train[] {
    return ALL_TRAINS.filter((train) => {
      const fromIdx = train.stops.findIndex((s) => s.stationId === fromStationId && s.time !== null);
      const toIdx = train.stops.findIndex((s) => s.stationId === toStationId && s.time !== null);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
  },

  /**
   * Filter a train list by service type (FAST / SLOW)
   */
  filterByType(trains: Train[], type: TrainType | 'ALL'): Train[] {
    if (type === 'ALL') return trains;
    return trains.filter((t) => t.trainType === type);
  },
};
