import type { Position } from "../types";
import type { PathfindingTaskResult } from "../task/types";
import type { PathfindingNodeConfig } from "./types";
export declare class PathfindingNode {
    readonly position: Position;
    readonly distance: number;
    private parent;
    private cost;
    constructor({ position, cost, distance, }: PathfindingNodeConfig);
    getBetterGuessDistance(): number;
    getCost(): number;
    setCost(cost: number): void;
    getParent(): PathfindingNode | null;
    setParent(parent: PathfindingNode): void;
    compute(): PathfindingTaskResult;
    getNextCost(shift: Position, points: number[][]): number;
}
