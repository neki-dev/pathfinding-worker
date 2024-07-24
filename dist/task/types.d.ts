import type { Position } from '../types';
export type PathfindingTaskConfig = {
    idTask: number;
    from: Position;
    to: Position;
    layer?: string;
};
export type PathfindingTaskResult = {
    path: Position[] | null;
    weight: number;
};
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
