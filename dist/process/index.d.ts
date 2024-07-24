import type { PathfindingTask } from '../task';
import type { PathfindingGrid, PathfindingPosition } from '../types';
export declare class PathfindingProcess {
    private layers;
    private weights;
    private taskQueue;
    private timer;
    constructor(rate?: number);
    destroy(): void;
    createTask(task: PathfindingTask): void;
    cancelTask(idTask: number): void;
    addLayer(layer: string, grid: PathfindingGrid): void;
    removeLayer(layer: string): void;
    setWeight(position: PathfindingPosition, weight: number): void;
    resetWeight(position: PathfindingPosition): void;
    setWalkable(layer: string, position: PathfindingPosition, state: boolean): void;
    private next;
    private getNextDirections;
    private isWalkable;
}
