import { PATHFINDING_DEFAULT_TILE_WEIGHT } from '../layer/const';

import type { PathfindingNodeConfig } from './types';
import type { PathfindingTaskResultRaw } from '../task/types';
import type { PathfindingPoint } from '../types';

/**
 * @internal
 */
export class PathfindingNode {
  readonly position: PathfindingPoint;

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

  public compute(): PathfindingTaskResultRaw {
    const weight = this.parent ? this.parent.getWeight() : 0;
    const path: number[] = [
      this.position.x,
      this.position.y,
    ];

    let parent = this.getParent();
    while (parent) {
      path.unshift(parent.position.x, parent.position.y);
      parent = parent.getParent();
    }

    return {
      path: new Uint8Array(path),
      weight,
    };
  }

  public getNextWeight(shift: PathfindingPoint, weights: number[][]): number {
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
