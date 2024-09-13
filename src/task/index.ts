import Heap from 'heap';

import { PathfindingNode } from '../node';

import type { PathfindingTaskConfig, PathfindingTaskResult } from './types';
import type { PathfindingPoint } from '../types';

/**
 * @internal
 */
export class PathfindingTask {
  public readonly from: PathfindingPoint;

  public readonly to: PathfindingPoint;

  public readonly id: number;

  public readonly diagonals: boolean;

  public readonly idLayer: string;

  private tree: PathfindingNode[][] = [];

  private nodes: Heap<PathfindingNode>;

  public readonly complete: (result: PathfindingTaskResult) => void;

  constructor(
    { idTask, from, to, idLayer, diagonals = true }: PathfindingTaskConfig,
    onComplete: (result: PathfindingTaskResult) => void,
  ) {
    this.id = idTask;
    this.from = { ...from };
    this.to = { ...to };
    this.idLayer = idLayer;
    this.diagonals = diagonals;
    this.complete = onComplete;

    this.nodes = new Heap<PathfindingNode>(
      (nodeA, nodeB) =>
        nodeA.getBetterGuessDistance() - nodeB.getBetterGuessDistance(),
    );

    const node = new PathfindingNode({
      position: this.from,
      distance: this.getDistanceFrom(this.from),
    });

    this.pushNode(node);
  }

  private getDistanceFrom(position: PathfindingPoint): number {
    return Math.sqrt(
      (position.x - this.to.x) ** 2 + (position.y - this.to.y) ** 2,
    );
  }

  public addNode(parent: PathfindingNode, position: PathfindingPoint, weight: number): void {
    const node = new PathfindingNode({
      position,
      distance: this.getDistanceFrom(position),
      weight,
    });

    node.setParent(parent);
    this.pushNode(node);
  }

  private pushNode(node: PathfindingNode): void {
    this.nodes.push(node);

    if (!this.tree[node.position.y]) {
      this.tree[node.position.y] = [];
    }
    this.tree[node.position.y][node.position.x] = node;
  }

  public pickNode(position: PathfindingPoint): PathfindingNode {
    return this.tree[position.y]?.[position.x];
  }

  public takeLastNode(): PathfindingNode | null {
    return this.nodes.pop() ?? null;
  }

  public useNode(current: PathfindingNode, next: PathfindingNode, weight: number): void {
    next.setWeight(weight);
    next.setParent(current);

    this.nodes.updateItem(next);
  }

  public getNextWeight(
    currentNode: PathfindingNode,
    shift: PathfindingPoint,
    weights: number[][],
  ): number {
    return currentNode.getWeight() + currentNode.getNextWeight(shift, weights);
  }
}
