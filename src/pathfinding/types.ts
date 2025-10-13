import type { ResourceLimits } from 'worker_threads';

export type PathfindingConfig = {
  /**
   * Finding next task rate
   * Default: 200 ms
   */
  loopRate?: number;

  /**
   * Worker resource limits
   */
  resourceLimits?: ResourceLimits;
};
