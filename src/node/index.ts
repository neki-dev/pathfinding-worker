import { PATHFINDING_DEFAULT_TILE_WEIGHT } from '../layer/const';

import type { PathfindingNodeConfig } from './types';
import type { PathfindingTaskResult } from '../task/types';
import type { PathfindingPosition } from '../types';

export class PathfindingNode {
  readonly position: PathfindingPosition;

  readonly distance: number;

  private parent: PathfindingNode | null = null;

  private weight: number;

  constructor({
    position,
    distance,
    weight = PATHFINDING_DEFAULT_TILE_WEIGHT,
  }: PathfindingNodeConfig) {
    this.position = { ...position };
    this.distance = distance;
    this.weight = weight;
  }

  public getBetterGuessDistance(): number {
    return this.weight + this.distance;
  }

  public getWeight(): number {
    return this.weight;
  }

  public setWeight(weight: number): void {
    this.weight = weight;
  }

  public getParent(): PathfindingNode | null {
    return this.parent;
  }

  public setParent(parent: PathfindingNode): void {
    this.parent = parent;
  }

  public compute(): PathfindingTaskResult {
    const path: PathfindingPosition[] = [{ ...this.position }];
    const weight = this.parent ? this.parent.getWeight() : 0;

    let parent = this.getParent();

    while (parent) {
      path.push({ ...parent.position });
      parent = parent.getParent();
    }

    path.reverse();

    return { path, weight };
  }

  public getNextWeight(shift: PathfindingPosition, weights: number[][]): number {
    const x = this.position.x + shift.x;
    const y = this.position.y + shift.y;
    const weight = weights[y]?.[x] ?? PATHFINDING_DEFAULT_TILE_WEIGHT;

    if (Math.abs(shift.x) + Math.abs(shift.y) !== 1) {
      return (
        weight * Math.SQRT2 +
        (weights[this.position.y]?.[x] ?? 0.0) +
        (weights[y]?.[this.position.x] ?? 0.0)
      );
    }

    return weight;
  }
}
