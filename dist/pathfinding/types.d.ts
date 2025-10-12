import type { ResourceLimits } from 'worker_threads';
export type PathfindingConfig = {
    /**
     * Finding next task rate
     * Default: 100 ms
     */
    loopRate?: number;
    /**
     * Processing task rate
     * Default: 0 ms
     */
    taskProcessRate?: number;
    /**
     * Worker resource limits
     */
    resourceLimits?: ResourceLimits;
};
