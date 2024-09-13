import type { ResourceLimits } from 'worker_threads';

export type PathfindingConfig = {
  /**
   * Finding process loop rate
   * Default: 200 ms
   */
  loopRate?: number;

  /**
   * Worker resource limits
   */
  resourceLimits?: ResourceLimits;
};

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
 * Grid cell position
 */
export type PathfindingPoint = {
  x: number;
  y: number;
};

/**
 * Grid
 */
export type PathfindingGrid = boolean[][];
