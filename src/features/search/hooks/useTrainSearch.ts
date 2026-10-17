import { useState, useMemo, useCallback } from 'react';
import { Station, Route, Train } from '@/types';
import { stationRepository, routeRepository, trainRepository } from '@/services/data';

interface UseTrainSearchResult {
  originQuery: string;
  setOriginQuery: (q: string) => void;
  destinationQuery: string;
  setDestinationQuery: (q: string) => void;

  originStation: Station | undefined;
  destinationStation: Station | undefined;

  matchingRoutes: Route[];
  matchingTrains: Train[];
  isValidRoute: boolean;

  swapStations: () => void;
  clear: () => void;
}

/**
 * Custom hook to manage station-to-station train searches.
 */
export function useTrainSearch(
  initialOrigin = '',
  initialDestination = ''
): UseTrainSearchResult {
  const [originQuery, setOriginQuery] = useState(initialOrigin);
  const [destinationQuery, setDestinationQuery] = useState(initialDestination);

  const originStation = useMemo(
    () => stationRepository.findByName(originQuery),
    [originQuery]
  );

  const destinationStation = useMemo(
    () => stationRepository.findByName(destinationQuery),
    [destinationQuery]
  );

  const matchingRoutes = useMemo(() => {
    if (!originStation || !destinationStation) return [];
    return routeRepository.findRoutesBetween(originStation.id, destinationStation.id);
  }, [originStation, destinationStation]);

  const matchingTrains = useMemo(() => {
    if (!originStation || !destinationStation) return [];
    return trainRepository.findTrainsBetween(originStation.id, destinationStation.id);
  }, [originStation, destinationStation]);

  const isValidRoute = matchingRoutes.length > 0;

  const swapStations = useCallback(() => {
    const tempOrigin = originQuery;
    setOriginQuery(destinationQuery);
    setDestinationQuery(tempOrigin);
  }, [originQuery, destinationQuery]);

  const clear = useCallback(() => {
    setOriginQuery('');
    setDestinationQuery('');
  }, []);

  return {
    originQuery,
    setOriginQuery,
    destinationQuery,
    setDestinationQuery,

    originStation,
    destinationStation,

    matchingRoutes,
    matchingTrains,
    isValidRoute,

    swapStations,
    clear,
  };
}
