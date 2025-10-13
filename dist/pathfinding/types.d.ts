import type { ResourceLimits } from 'worker_threads';
export type PathfindingConfig = {
    /**
     * Use taskFindingRate instead
     * @deprecated
     */
    loopRate?: number;
    /**
     * Pause before executing the next task after all previous ones have been completed
     * Default: 100 ms
     */
    taskFindingRate?: number;
    /**
     * Max recursive depth to handle task in one tick
     * Default: 128
     */
    maxStackSize?: number;
    /**
     * Worker resource limits
     */
    resourceLimits?: ResourceLimits;
};
