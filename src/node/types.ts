import type { PathfindingPosition } from '../types';

/**
 * @internal
 */
export type PathfindingNodeConfig = {
  position: PathfindingPosition;
  distance: number;
  weight?: number;
};
