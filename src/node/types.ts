import type { PathfindingPosition } from '../types';

export type PathfindingNodeConfig = {
  position: PathfindingPosition;
  distance: number;
  weight?: number;
};
