import type { ResourceLimits } from 'worker_threads';
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
    /**
     * Worker resource limits
     */
    resourceLimits?: ResourceLimits;
};
export type PathfindingTaskConfig = {
    /**
     * Begin tile position
     */
    from: PathfindingPosition;
    /**
     * End tile position
     */
    to: PathfindingPosition;
    /**
     * Allow diagonal directions
     */
    diagonals?: boolean;
};
export type PathfindingPosition = {
    x: number;
    y: number;
};
export type PathfindingGrid = boolean[][];
