import type { PathfindingPosition } from '../types';

export type PathfindingTaskConfig = {
  idTask: number;
  from: PathfindingPosition;
  to: PathfindingPosition;
  layer: string;
};

export type PathfindingTaskResult = {
  path: PathfindingPosition[] | null;
  weight: number;
};

export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
