import { Train } from '../models/train';
import { Route } from '../models/route';
import { TrackingResult } from '../models/tracking';

/**
 * Universal Tracking Engine Interface.
 * Can be implemented by ScheduleTrackingEngine, GpsTrackingEngine,
 * or future Hybrid/Crowdsourced engines without altering UI consumers.
 */
export interface ITrackingEngine {
  /**
   * Calculate train position and journey status.
   * @param train The Train model with stop schedules
   * @param route Optional Route model
   * @param referenceTime Date/time for calculation (defaults to current system time)
   */
  calculate(train: Train, route?: Route | null, referenceTime?: Date): TrackingResult;
}
