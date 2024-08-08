import type { PathfindingPosition } from '../types';

export type PathfindingTaskConfig = {
  idTask: number;
  idLayer: string;
  from: PathfindingPosition;
  to: PathfindingPosition;
  diagonals?: boolean;
};

export type PathfindingTaskResult = {
  path: PathfindingPosition[] | null;
  weight: number;
};

export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
