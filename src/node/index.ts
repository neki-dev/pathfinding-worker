import type { Position } from "../types";
import type { PathfindingTaskResult } from "../task/types";

import type { PathfindingNodeConfig } from "./types";

export class PathfindingNode {
  readonly position: Position;

  readonly distance: number;

  private parent: PathfindingNode | null = null;

  private cost: number;

  constructor({
    position,
    cost = 1.0,
    distance,
  }: PathfindingNodeConfig) {
    this.position = { ...position };
    this.distance = distance;
    this.cost = cost;
  }

  public getBetterGuessDistance(): number {
    return this.cost + this.distance;
  }

  public getCost(): number {
    return this.cost;
  }

  public setCost(cost: number): void {
    this.cost = cost;
  }

  public getParent(): PathfindingNode | null {
    return this.parent;
  }

  public setParent(parent: PathfindingNode): void {
    this.parent = parent;
  }

  public compute(): PathfindingTaskResult {
    const path: Position[] = [{ ...this.position }];
    const cost = this.parent ? this.parent.getCost() : 0;

    let parent = this.getParent();

    while (parent) {
      path.push({ ...parent.position });
      parent = parent.getParent();
    }

    path.reverse();

    return { path, cost };
  }

  public getNextCost(shift: Position, points: number[][]): number {
    const nextPosition = {
      x: this.position.x + shift.x,
      y: this.position.y + shift.y,
    };
    const cost = points[nextPosition.y]?.[nextPosition.x] ?? 1.0;

    if (Math.abs(shift.x) + Math.abs(shift.y) !== 1) {
      return (
        cost * Math.SQRT2 +
        (points[this.position.y]?.[nextPosition.x] ?? 0.0) +
        (points[nextPosition.y]?.[this.position.x] ?? 0.0)
      );
    }

    return cost;
  }
}
