import type { PathfindingPoint } from '../types';

/**
 * Parameters for task create
 */
export type PathfindingTaskConfig = {
  /**
   * Begin tile position
   */
  from: PathfindingPoint;

  /**
   * End tile position
   */
  to: PathfindingPoint;

  /**
   * Allow diagonal directions
   */
  diagonals?: boolean;
};

/**
 * Task result
 */
export type PathfindingTaskResult = {
  /**
   * Path from starting cell to ending cell
   * Will be null if path is not found
   */
  path: PathfindingPoint[] | null;

  /**
   * Total path weight
   */
  weight: number;
};

/**
 * Callback with task result
 */
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;

/**
 * @internal
 */
export type PathfindingTaskFullConfig = PathfindingTaskConfig & {
  idTask: number;
  idLayer: string;
};

/**
 * @internal
 */
export type PathfindingTaskResultRaw = {
  path: Uint8Array | null;
  weight: number;
};
