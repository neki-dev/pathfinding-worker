import type { PathfindingPosition } from '../types';
/**
 * Task result
 */
export type PathfindingTaskResult = {
    /**
     * Path from starting cell to ending cell
     * Will be null if path is not found
     */
    path: PathfindingPosition[] | null;
    /**
     * Total path weight
     */
    weight: number;
};
/**
 * Callback with task result
 */
export type PathfindingTaskCallback = (result: PathfindingTaskResult) => void;
