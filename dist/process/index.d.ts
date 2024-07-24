import type { PathfindingTask } from '../task';
import type { PathfindingGrid, Position } from '../types';
export declare class PathfindingProcess {
    private grids;
    private weights;
    private taskQueue;
    private timer;
    constructor(grids: Record<string, PathfindingGrid>);
    destroy(): void;
    createTask(task: PathfindingTask): void;
    cancelTask(idTask: number): void;
    setWeight(position: Position, weight: number): void;
    resetWeight(position: Position): void;
    setWalkable(layer: string, position: Position, state: boolean): void;
    private next;
    private getNextDirections;
    private isWalkable;
}
