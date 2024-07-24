import type { Position } from "../types";

export type PathfindingTaskConfig = {
  idTask: number;
  from: Position;
  to: Position;
  group: string;
};

export type PathfindingTaskResult = {
  path: Position[] | null;
  cost: number;
};

export type PathfindingTaskResultCallback = (result: PathfindingTaskResult) => void;
