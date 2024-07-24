import { PathfindingNode } from '../node';
import type { PathfindingTaskConfig, PathfindingTaskResult } from './types';
import type { Position } from '../types';
export declare class PathfindingTask {
    readonly from: Position;
    readonly to: Position;
    readonly id: number;
    readonly layer: string;
    private tree;
    private nodes;
    readonly complete: (result: PathfindingTaskResult) => void;
    constructor({ idTask, from, to, layer }: PathfindingTaskConfig, onComplete: (result: PathfindingTaskResult) => void);
    private getDistanceFrom;
    addNode(parent: PathfindingNode, position: Position, weight: number): void;
    private pushNode;
    pickNode(position: Position): PathfindingNode;
    takeLastNode(): PathfindingNode | null;
    useNode(current: PathfindingNode, next: PathfindingNode, weight: number): void;
    getNextWeight(currentNode: PathfindingNode, shift: Position, points: number[][]): number;
}
