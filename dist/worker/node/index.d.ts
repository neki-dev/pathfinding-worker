import { Position } from "../../types";
import type { NavigatorNodeConfig, NavigatorNodeResult } from "./types";
export declare class NavigatorNode {
    readonly position: Position;
    readonly distance: number;
    private parent;
    private cost;
    constructor({ position, cost, distance, parent, }: NavigatorNodeConfig);
    getBetterGuessDistance(): number;
    getCost(): number;
    setCost(cost: number): void;
    getParent(): NavigatorNode | null;
    setParent(parent: NavigatorNode): void;
    getResult(): NavigatorNodeResult;
    getNextCost(shift: Position, points: number[][]): number;
}
