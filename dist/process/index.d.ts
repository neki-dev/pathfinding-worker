import type { PathfindingTask } from '../task';
import type { PathfindingGrid, PathfindingPosition } from '../types';
export declare class PathfindingProcess {
    private readonly grids;
    private readonly weights;
    private queue;
    private timer;
    constructor(loopRate?: number);
    destroy(): void;
    createTask(task: PathfindingTask): void;
    cancelTask(idLayer: string, idTask: number): void;
    addLayer(idLayer: string, grid: PathfindingGrid): void;
    removeLayer(idLayer: string): void;
    setWeight(idLayer: string, position: PathfindingPosition, value: number | null): void;
    setWalkable(idLayer: string, position: PathfindingPosition, state: boolean): void;
    private next;
    private getNextDirections;
    private isWalkable;
}
