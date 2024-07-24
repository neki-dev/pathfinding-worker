export type PathfindingConfig = {
  /**
   * Finding process loop rate
   * Default: 200 ms
   */
  loopRate?: number;

  /**
   * Path to worker file
   * Default: ./pathfinder.worker.js
   */
  workerPath?: string;
};

export type PathfindingTaskConfig = {
  /**
   * Layer of grid
   */
  layer: string;

  /**
   * Begin tile position
   */
  from: PathfindingPosition;

  /**
   * End tile position
   */
  to: PathfindingPosition;
};

export type PathfindingPosition = {
  x: number;
  y: number;
};

export type PathfindingGrid = boolean[][];
