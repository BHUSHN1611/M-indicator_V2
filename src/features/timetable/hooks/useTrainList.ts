import { useState, useMemo } from 'react';
import { Train, TrainType } from '@/types';
import { trainRepository } from '@/services/data';

import { TrainFilterCategory } from '@/constants';

interface UseTrainListOptions {
  routeId?: string;
  initialFilter?: TrainFilterCategory;
}

interface UseTrainListResult {
  filter: TrainFilterCategory;
  setFilter: (f: TrainFilterCategory) => void;

  allTrains: Train[];
  filteredTrains: Train[];

  totalCount: number;
  fastCount: number;
  slowCount: number;
}

/**
 * Custom hook to retrieve and filter train listings by service type.
 */
export function useTrainList(options: UseTrainListOptions = {}): UseTrainListResult {
  const { routeId, initialFilter = 'ALL' } = options;
  const [filter, setFilter] = useState<TrainFilterCategory>(initialFilter);

  const allTrains = useMemo(() => {
    if (routeId) {
      return trainRepository.getByRoute(routeId);
    }
    return trainRepository.getAll();
  }, [routeId]);

  const fastCount = useMemo(
    () => allTrains.filter((t) => t.trainType === 'FAST').length,
    [allTrains]
  );

  const slowCount = useMemo(
    () => allTrains.filter((t) => t.trainType === 'SLOW').length,
    [allTrains]
  );

  const filteredTrains = useMemo(() => {
    if (filter === 'ALL') return allTrains;
    return allTrains.filter((t) => t.trainType === (filter as TrainType));
  }, [allTrains, filter]);

  return {
    filter,
    setFilter,
    allTrains,
    filteredTrains,
    totalCount: allTrains.length,
    fastCount,
    slowCount,
  };
}
