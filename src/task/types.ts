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

export type PathfindingTaskResult = {
  /**
   * Path result
   */
  path: PathfindingPosition[] | null;

  /**
   * Total path weight
   */
  weight: number;
};

/**
 * Callback with task result
 */
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
