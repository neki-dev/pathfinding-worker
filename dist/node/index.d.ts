import type { PathfindingNodeConfig } from './types';
import type { PathfindingTaskResult } from '../task/types';
import type { Position } from '../types';
export declare class PathfindingNode {
    readonly position: Position;
    readonly distance: number;
    private parent;
    private weight;
    constructor({ position, weight, distance, }: PathfindingNodeConfig);
    getBetterGuessDistance(): number;
    getWeight(): number;
    setWeight(weight: number): void;
    getParent(): PathfindingNode | null;
    setParent(parent: PathfindingNode): void;
    compute(): PathfindingTaskResult;
    getNextWeight(shift: Position, weights: number[][]): number;
}
