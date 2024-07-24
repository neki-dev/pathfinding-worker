import { NavigatorNode } from "../node";
import type { NavigatorTaskConfig } from "./types";
import { Position } from "../../types";
export declare class NavigatorTask {
    readonly from: Position;
    readonly to: Position;
    readonly id: number;
    readonly group: string;
    private tree;
    private nodes;
    constructor({ idTask, from, to, group }: NavigatorTaskConfig);
    private getDistanceFrom;
    addNode(parent: NavigatorNode, position: Position, cost: number): void;
    private pushNode;
    pickNode(position: Position): NavigatorNode;
    takeLastNode(): NavigatorNode | null;
    useNode(current: NavigatorNode, next: NavigatorNode, cost: number): void;
    getNextCost(currentNode: NavigatorNode, shift: Position, points: number[][]): number;
}
