import type { PathfindingNodeConfig } from './types';
import type { PathfindingTaskResult } from '../task/types';
import type { Position } from '../types';

export class PathfindingNode {
  readonly position: Position;

  readonly distance: number;

  private parent: PathfindingNode | null = null;

  private weight: number;

  constructor({
    position,
    weight = 1.0,
    distance,
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
    const path: Position[] = [{ ...this.position }];
    const weight = this.parent ? this.parent.getWeight() : 0;

    let parent = this.getParent();

    while (parent) {
      path.push({ ...parent.position });
      parent = parent.getParent();
    }

    path.reverse();

    return { path, weight };
  }

  public getNextWeight(shift: Position, points: number[][]): number {
    const nextPosition = {
      x: this.position.x + shift.x,
      y: this.position.y + shift.y,
    };
    const weight = points[nextPosition.y]?.[nextPosition.x] ?? 1.0;

    if (Math.abs(shift.x) + Math.abs(shift.y) !== 1) {
      return (
        weight * Math.SQRT2 +
        (points[this.position.y]?.[nextPosition.x] ?? 0.0) +
        (points[nextPosition.y]?.[this.position.x] ?? 0.0)
      );
    }

    return weight;
  }
}
