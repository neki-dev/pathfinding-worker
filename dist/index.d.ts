import { Worker } from 'worker_threads';
import type { PathfindingTaskCallback } from './task/types';
import type { PathfindingGrid, PathfindingTaskConfig, PathfindingPosition, PathfindingConfig } from './types';
export declare class Pathfinding {
    readonly worker: Worker;
    private weights;
    private layers;
    private lastTaskId;
    private resultCallbacks;
    private readonly events;
    /**
     * Create pathfinding worker thread.
     *
     * @param config - Pathfinding configuration
     */
    constructor({ workerPath, loopRate, }?: PathfindingConfig);
    /**
     * Terminate worker thread.
     */
    destroy(): Promise<number>;
    /**
     * Add new layer of grid.
     *
     * @param layer - Layer name
     * @param grid - Grid with walkable tiles
     */
    addLayer(layer: string, grid: PathfindingGrid): void;
    /**
     * Get layer of grid.
     *
     * @param layer - Layer name
     */
    getLayer(layer: string): PathfindingGrid;
    /**
     * Remove exist layer of grid.
     *
     * @param layer - Layer name
     */
    removeLayer(layer: string): void;
    /**
     * Update walkable state of tile.
     *
     * @param layer - Layer of grid
     * @param position - Tile position
     * @param state - Walkable state
     */
    setWalkable(layer: string, position: PathfindingPosition, state: boolean): void;
    /**
     * Get walkable state of tile.
     *
     * @param layer - Layer of grid
     * @param position - Tile position
     */
    isWalkable(layer: string, position: PathfindingPosition): boolean;
    /**
     * Update tile weight.
     *
     * @param position - Tile position
     * @param value - New weight
     */
    setWeight(position: PathfindingPosition, value: number): void;
    /**
     * Set tile weight to default value.
     *
     * @param position - Tile position
     */
    resetWeight(position: PathfindingPosition): void;
    /**
     * Get tile weight.
     *
     * @param position - Tile position
     */
    getWeight(position: PathfindingPosition): number;
    /**
     * Create a new task to find path between two tiles.
     *
     * @param config - Task configuration
     * @param callback - Callback with result
     *
     * @returns Id of created task
     */
    createTask(config: PathfindingTaskConfig, callback: PathfindingTaskCallback): number;
    /**
     * Cancel exist task by id.
     *
     * @param id - Task id
     */
    cancelTask(id: number): void;
}
