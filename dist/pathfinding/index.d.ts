import { Worker } from 'worker_threads';
import { PathfindingEvents } from '../events';
import { PathfindingLayer } from '../layer';
import type { PathfindingConfig } from './types';
import type { PathfindingGrid } from '../types';
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
     * Get list of created layers.
     */
    getLayers(): PathfindingLayer[];
    /**
     * Get layer by id.
     *
     * @param id - Layer id
     */
    getLayer(id: string): PathfindingLayer | null;
    /**
     * Remove layer of grid.
     *
     * @param id - Layer id
     */
    removeLayer(id: string): void;
    private static unflatPath;
}
