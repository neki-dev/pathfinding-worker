import type { ResourceLimits } from 'worker_threads';
export type PathfindingConfig = {
    /**
     * Finding process loop rate
     * Default: 200 ms
     */
    loopRate?: number;
    /**
     * Worker resource limits
     */
    resourceLimits?: ResourceLimits;
};
