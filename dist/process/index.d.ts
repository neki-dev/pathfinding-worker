import type { Position } from "../types";
import type { PathfindingTask } from "../task";
export declare class PathfindingProcess {
    private grids;
    private pointsCost;
    private taskQueue;
    private timer;
    constructor(grids: Record<string, boolean[][]>);
    destroy(): void;
    createTask(task: PathfindingTask): void;
    cancelTask(idTask: number): void;
    setPointCost(position: Position, cost: number): void;
    resetPointCost(position: Position): void;
    setWalkable(group: string, position: Position, state: boolean): void;
    private next;
    private getNextDirections;
    private isWalkable;
}
