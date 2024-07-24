import Heap from 'heap';

import { PATHFINDING_DEFUALT_LAYER } from '../const';
import { PathfindingNode } from '../node';

import type { PathfindingTaskConfig, PathfindingTaskResult } from './types';
import type { Position } from '../types';

export class PathfindingTask {
  readonly from: Position;

  readonly to: Position;

  readonly id: number;

  readonly layer: string;

  private tree: PathfindingNode[][] = [];

  private nodes: Heap<PathfindingNode>;

  public readonly complete: (result: PathfindingTaskResult) => void;

  constructor({ idTask, from, to, layer }: PathfindingTaskConfig, onComplete: (result: PathfindingTaskResult) => void) {
    this.id = idTask;
    this.from = { ...from };
    this.to = { ...to };
    this.layer = layer ?? PATHFINDING_DEFUALT_LAYER;
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

  private getDistanceFrom(position: Position): number {
    return Math.sqrt(
      (position.x - this.to.x) ** 2 + (position.y - this.to.y) ** 2,
    );
  }

  public addNode(parent: PathfindingNode, position: Position, weight: number): void {
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

  public pickNode(position: Position): PathfindingNode {
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
    shift: Position,
    weights: number[][],
  ): number {
    return currentNode.getWeight() + currentNode.getNextWeight(shift, weights);
  }
}
