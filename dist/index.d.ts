import { Worker } from "worker_threads";
import type { PathfindingTaskConfig, Position } from "./types";
import type { PathfindingTaskResultCallback } from "./task/types";
export declare class Pathfinding {
    readonly worker: Worker;
    private pointsCost;
    private lastTaskId;
    private resultCallbacks;
    constructor(grids: Record<string, boolean[][]>);
    destroy(): void;
    setWalkable(group: string, position: Position, state: boolean): void;
    setPointCost(position: Position, cost: number): void;
    resetPointCost(position: Position): void;
    getPointCost(position: Position): number;
    createTask(config: PathfindingTaskConfig, callback: PathfindingTaskResultCallback): number;
    getTaskCallback(idTask: number): PathfindingTaskResultCallback | null;
    cancelTask(idTask: number): void;
    private listen;
    private send;
}
