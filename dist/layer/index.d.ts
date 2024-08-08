import type { Pathfinding } from '..';
import type { PathfindingTaskCallback } from '../task/types';
import type { PathfindingGrid, PathfindingPosition, PathfindingTaskConfig } from '../types';
export declare class PathfindingLayer {
    readonly uuid: string;
    private readonly pathfinding;
    private readonly grid;
    private readonly weights;
    private lastTaskId;
    readonly handlers: Map<number, PathfindingTaskCallback>;
    constructor(pathfinding: Pathfinding, grid: PathfindingGrid);
    /**
     * Remove layer.
     */
    remove(): void;
    /**
     * Update walkable state of tile.
     *
     * @param position - Tile position
     * @param state - Walkable state
     */
    setWalkable(position: PathfindingPosition, state: boolean): void;
    /**
     * Get walkable state of tile.
     *
     * @param position - Tile position
     */
    isWalkable(position: PathfindingPosition): boolean;
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
    findPath(config: PathfindingTaskConfig, callback: PathfindingTaskCallback): number;
    /**
     * Cancel exist task by id.
     *
     * @param id - Task id
     */
    cancel(id: number): void;
}
