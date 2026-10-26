/**
 * Application global store interface.
 * Can be plugged with Zustand / Redux / Context when needed.
 */
export interface AppState {
  isInitialized: boolean;
}

export const initialAppState: AppState = {
  isInitialized: true,
};
