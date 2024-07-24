import { PathfindingNode } from "../node";
import type { PathfindingTaskConfig, PathfindingTaskResult } from "./types";
import type { Position } from "../types";
export declare class PathfindingTask {
    readonly from: Position;
    readonly to: Position;
    readonly id: number;
    readonly group: string;
    private tree;
    private nodes;
    readonly complete: (result: PathfindingTaskResult) => void;
    constructor({ idTask, from, to, group }: PathfindingTaskConfig, onComplete: (result: PathfindingTaskResult) => void);
    private getDistanceFrom;
    addNode(parent: PathfindingNode, position: Position, cost: number): void;
    private pushNode;
    pickNode(position: Position): PathfindingNode;
    takeLastNode(): PathfindingNode | null;
    useNode(current: PathfindingNode, next: PathfindingNode, cost: number): void;
    getNextCost(currentNode: PathfindingNode, shift: Position, points: number[][]): number;
}
