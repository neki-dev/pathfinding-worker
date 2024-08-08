import { PathfindingNode } from '../node';
import type { PathfindingTaskConfig, PathfindingTaskResult } from './types';
import type { PathfindingPosition } from '../types';
export declare class PathfindingTask {
    readonly from: PathfindingPosition;
    readonly to: PathfindingPosition;
    readonly id: number;
    readonly diagonals: boolean;
    readonly idLayer: string;
    private tree;
    private nodes;
    readonly complete: (result: PathfindingTaskResult) => void;
    constructor({ idTask, from, to, idLayer, diagonals }: PathfindingTaskConfig, onComplete: (result: PathfindingTaskResult) => void);
    private getDistanceFrom;
    addNode(parent: PathfindingNode, position: PathfindingPosition, weight: number): void;
    private pushNode;
    pickNode(position: PathfindingPosition): PathfindingNode;
    takeLastNode(): PathfindingNode | null;
    useNode(current: PathfindingNode, next: PathfindingNode, weight: number): void;
    getNextWeight(currentNode: PathfindingNode, shift: PathfindingPosition, weights: number[][]): number;
}
