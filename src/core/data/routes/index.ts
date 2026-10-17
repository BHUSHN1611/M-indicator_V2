import { Route } from '../../models/route';
import { WESTERN_LINE_ROUTES } from './westernLineRoutes';

export const ALL_ROUTES: Route[] = [
  ...WESTERN_LINE_ROUTES,
];

const routesById = new Map<string, Route>();
for (const route of ALL_ROUTES) {
  routesById.set(route.id, route);
}

export const routeRepository = {
  /** Get all available routes */
  getAll(): Route[] {
    return ALL_ROUTES;
  },

  /** Get a route by its ID (e.g. 'WR_VR_DRD_DN') */
  getById(id: string): Route | undefined {
    return routesById.get(id);
  },

  /**
   * Find all routes that connect fromStation to toStation in order
   */
  findRoutesBetween(fromStationId: string, toStationId: string): Route[] {
    return ALL_ROUTES.filter((route) => {
      const fromIdx = route.stops.findIndex((s) => s.stationId === fromStationId);
      const toIdx = route.stops.findIndex((s) => s.stationId === toStationId);
      // Both stations must be on this route, and fromStation must occur before toStation
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
  },
};
