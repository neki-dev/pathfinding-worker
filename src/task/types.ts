import type { PathfindingPoint } from '../types';

/**
 * @internal
 */
export type PathfindingTaskConfig = {
  idTask: number;
  idLayer: string;
  from: PathfindingPoint;
  to: PathfindingPoint;
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
