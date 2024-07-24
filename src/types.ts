export type PathfindingTaskConfig = {
  /** Begin tile position */
  from: Position;

  /** End tile position */
  to: Position;

  /** Layer of grid if pathfinder has a few grids */
  layer?: string;
};

export type Position = {
  x: number;
  y: number;
};

export type PathfindingGrid = boolean[][];
