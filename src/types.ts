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

  /**
   * Create worker script in runtime mode
   * Default: true
   */
  runtime?: boolean;
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
