import { Worker } from 'worker_threads';
import type { PathfindingTaskCallback } from './task/types';
import type { PathfindingGrid, PathfindingTaskConfig, Position } from './types';
export declare class Pathfinding {
    readonly worker: Worker;
    private weights;
    private layers;
    private lastTaskId;
    private resultCallbacks;
    private readonly events;
    /**
     * Spawn pathfinding worker thread.
     *
     * @param grid - Grid (or layers of grid) with walkable tiles. Order of indexes is grid[y][x]
     */
    constructor(grid: Record<string, PathfindingGrid> | PathfindingGrid);
    /**
     * Terminate worker thread.
     */
    destroy(): void;
    /**
     * Add a new layer grid.
     *
     * @param layer - Layer name
     * @param grid - Grid with walkable tiles
     */
    addLayer(layer: string, grid: PathfindingGrid): void;
    /**
     * Get layer grid.
     *
     * @param layer - Layer name
     */
    getLayer(layer: string): PathfindingGrid;
    /**
     * Remove exist layer grid.
     *
     * @param layer - Layer name
     */
    removeLayer(layer: string): void;
    /**
     * Update walkable state of tile.
     *
     * @param position - Tile position
     * @param state - Walkable state
     * @param layer - Layer of grid if pathfinder has a few layers
     */
    setWalkable(position: Position, state: boolean, layer?: string): void;
    /**
     * Get walkable state of tile.
     *
     * @param position - Tile position
     * @param layer - Layer of grid if pathfinder has a few layers
     */
    isWalkable(position: Position, layer?: string): boolean;
    /**
     * Update tile weight.
     *
     * @param position - Tile position
     * @param value - New weight
     */
    setWeight(position: Position, value: number): void;
    /**
     * Set tile weight to default value.
     *
     * @param position - Tile position
     */
    resetWeight(position: Position): void;
    /**
     * Get tile weight.
     *
     * @param position - Tile position
     */
    getWeight(position: Position): number;
    /**
     * Create a new task to find path between two tiles.
     *
     * @param config - Task configuration
     * @param callback - Callback with result path
     *
     * @returns Id of created task
     */
    createTask(config: PathfindingTaskConfig, callback: PathfindingTaskCallback): number;
    /**
     * Cancel exist task by id.
     *
     * @param idTask - Task id
     */
    cancelTask(idTask: number): void;
}
