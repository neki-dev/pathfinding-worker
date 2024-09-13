import type { PathfindingPoint } from '../types';

/**
 * @internal
 */
export type PathfindingNodeConfig = {
  position: PathfindingPoint;
  distance: number;
  weight?: number;
};
