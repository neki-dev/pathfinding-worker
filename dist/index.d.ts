import { Worker } from 'worker_threads';
import { PathfindingEvents } from './events';
import { PathfindingLayer } from './layer';
import type { PathfindingTaskCallback, PathfindingTaskResult } from './task/types';
import type { PathfindingGrid, PathfindingConfig, PathfindingPoint } from './types';
export declare class Pathfinding {
    readonly worker: Worker;
    readonly events: PathfindingEvents;
    private readonly layers;
    /**
     * Create pathfinding worker thread.
     *
     * @param config - Pathfinding configuration
     */
    constructor({ loopRate, resourceLimits }?: PathfindingConfig);
    /**
     * Terminate worker thread.
     */
    destroy(): Promise<number>;
    /**
     * Create a new layer of grid.
     *
     * @param grid - Grid with walkable tiles
     */
    createLayer(grid: PathfindingGrid): PathfindingLayer;
    /**
     * Check for layer presence.
     *
     * @param id - Layer id
     */
    hasLayer(id: string): boolean;
    /**
     * Remove layer of grid.
     *
     * @param id - Layer id
     */
    removeLayer(id: string): void;
    private unflatPath;
}
export type { PathfindingGrid, PathfindingPoint, PathfindingLayer, PathfindingTaskCallback, PathfindingTaskResult, };
