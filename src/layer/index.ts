import { v4 as uuid } from 'uuid';

import { PathfindingEvent } from '../events/types';

import type { Pathfinding } from '..';
import type { PathfindingTaskCallback } from '../task/types';
import type { PathfindingGrid, PathfindingPosition, PathfindingTaskConfig } from '../types';

export class PathfindingLayer {
  public readonly uuid: string;

  private readonly pathfinding: Pathfinding;

  private readonly grid: PathfindingGrid;

  private readonly weights: number[][] = [];

  private lastTaskId: number = 0;

  public readonly handlers: Map<number, PathfindingTaskCallback> = new Map();

  constructor(pathfinding: Pathfinding, grid: PathfindingGrid) {
    this.pathfinding = pathfinding;
    this.grid = grid;
    this.uuid = uuid();
  }

  /**
   * Remove layer.
   */
  public remove(): void {
    this.pathfinding.removeLayer(this.uuid);
  }

  /**
   * Update walkable state of tile.
   *
   * @param position - Tile position
   * @param state - Walkable state
   */
  public setWalkable(position: PathfindingPosition, state: boolean): void {
    if (this.isWalkable(position) === state) {
      return;
    }

    if (!this.grid[position.y]) {
      this.grid[position.y] = [];
    }
    this.grid[position.y][position.x] = state;

    this.pathfinding.events.send(PathfindingEvent.SetWalkable, {
      idLayer: this.uuid,
      position,
      state,
    });
  }

  /**
   * Get walkable state of tile.
   *
   * @param position - Tile position
   */
  public isWalkable(position: PathfindingPosition): boolean {
    return Boolean(this.grid[position.y]?.[position.x]);
  }

  /**
   * Update tile weight.
   *
   * @param position - Tile position
   * @param value - New weight
   */
  public setWeight(position: PathfindingPosition, value: number): void {
    if (this.getWeight(position) === value) {
      return;
    }

    if (!this.weights[position.y]) {
      this.weights[position.y] = [];
    }
    this.weights[position.y][position.x] = value;

    this.pathfinding.events.send(PathfindingEvent.SetWeight, {
      idLayer: this.uuid,
      position,
      value,
    });
  }

  /**
   * Set tile weight to default value.
   *
   * @param position - Tile position
   */
  public resetWeight(position: PathfindingPosition): void {
    if (this.weights[position.y]?.[position.x] === undefined) {
      return;
    }

    delete this.weights[position.y][position.x];

    this.pathfinding.events.send(PathfindingEvent.SetWeight, {
      idLayer: this.uuid,
      position,
      value: null,
    });
  }

  /**
   * Get tile weight.
   *
   * @param position - Tile position
   */
  public getWeight(position: PathfindingPosition): number {
    return this.weights[position.y]?.[position.x] ?? 1.0;
  }

  /**
   * Create a new task to find path between two tiles.
   *
   * @param config - Task configuration
   * @param callback - Callback with result
   *
   * @returns Id of created task
   */
  public findPath(
    config: PathfindingTaskConfig,
    callback: PathfindingTaskCallback,
  ): number {
    const id = ++this.lastTaskId;

    this.pathfinding.events.send(PathfindingEvent.CreateTask, {
      ...config,
      idLayer: this.uuid,
      idTask: id,
    });

    this.handlers.set(id, callback);

    return id;
  }

  /**
   * Cancel exist task by id.
   *
   * @param id - Task id
   */
  public cancel(id: number): void {
    if (!this.handlers.has(id)) {
      throw Error(`Pathfinding task with id '${id}' is not found`);
    }

    this.pathfinding.events.send(PathfindingEvent.CancelTask, {
      idLayer: this.uuid,
      idTask: id,
    });

    this.handlers.delete(id);
  }
}
