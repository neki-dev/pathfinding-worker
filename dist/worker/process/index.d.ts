import type { NavigatorGridGroup, Position } from "../../types";
import type { NavigatorTask } from "../task";
export declare class NavigatorProcess {
    private grids;
    private pointsCost;
    private taskQueue;
    private timer;
    constructor(grids: Record<string, boolean[][]>);
    destroy(): void;
    createTask(task: NavigatorTask): void;
    cancelTask(idTask: number): void;
    setPointCost(position: Position, cost: number): void;
    resetPointCost(position: Position): void;
    setWalkable(group: NavigatorGridGroup, position: Position, state: boolean): void;
    private next;
    private getNextDirections;
    private isWalkable;
    private completeTask;
}
