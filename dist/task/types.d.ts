import type { PathfindingPosition } from '../types';
export type PathfindingTaskResult = {
    /**
     * Path result
     */
    path: PathfindingPosition[] | null;
    /**
     * Total path weight
     */
    weight: number;
};
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
