import type { PathfindingPosition } from '../types';

/**
 * @internal
 */
export type PathfindingTaskConfig = {
  idTask: number;
  idLayer: string;
  from: PathfindingPosition;
  to: PathfindingPosition;
  diagonals?: boolean;
};

/**
 * @internal
 */
export type PathfindingTaskResult = {
  path: PathfindingPosition[] | null;
  weight: number;
};

/**
 * @internal
 */
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
