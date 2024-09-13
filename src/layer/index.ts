import { v4 as uuid } from 'uuid';

import { PATHFINDING_DEFAULT_TILE_WEIGHT } from './const';
import { PathfindingEvent } from '../events/types';

import type { Pathfinding } from '../pathfinding';
import type { PathfindingTaskCallback, PathfindingTaskConfig } from '../task/types';
import type { PathfindingGrid, PathfindingPoint } from '../types';

export class PathfindingLayer {
  public readonly id: string;

  private readonly pathfinding: Pathfinding;

  private readonly grid: PathfindingGrid;

  private readonly weights: number[][] = [];

  private lastTaskId: number = 0;

  public readonly handlers: Map<number, PathfindingTaskCallback> = new Map();

  constructor(pathfinding: Pathfinding, grid: PathfindingGrid) {
    this.pathfinding = pathfinding;
    this.grid = grid;
    this.id = uuid();
  }

  /**
   * Remove layer.
   */
  public remove(): void {
    this.pathfinding.removeLayer(this.id);
  }

  /**
   * Update walkable state of tile.
   *
   * @param position - Tile position
   * @param state - Walkable state
   */
  public setWalkable(position: PathfindingPoint, state: boolean): void {
    if (!this.isPointValid(position)) {
      throw Error('Invalid position. Non-integer values');
    }

    if (this.isWalkable(position) === state) {
      return;
    }

    this.grid[position.y][position.x] = state;

    this.pathfinding.events.send(PathfindingEvent.SetWalkable, {
      idLayer: this.id,
      position,
      state,
    });
  }

  /**
   * Get walkable state of tile.
   *
   * @param position - Tile position
   */
  public isWalkable(position: PathfindingPoint): boolean {
    if (!this.isPointValid(position)) {
      throw Error('Invalid position. Non-integer values');
    }

    return Boolean(this.grid[position.y]?.[position.x]);
  }

  /**
   * Update tile weight.
   *
   * @param position - Tile position
   * @param value - New weight
   */
  public setWeight(position: PathfindingPoint, value: number): void {
    if (!this.isPointValid(position)) {
      throw Error('Invalid position. Non-integer values');
    }

    if (this.getWeight(position) === value) {
      return;
    }

    if (!this.weights[position.y]) {
      this.weights[position.y] = [];
    }
    this.weights[position.y][position.x] = value;

    this.pathfinding.events.send(PathfindingEvent.SetWeight, {
      idLayer: this.id,
      position,
      value,
    });
  }

  /**
   * Set tile weight to default value.
   *
   * @param position - Tile position
   */
  public resetWeight(position: PathfindingPoint): void {
    if (!this.isPointValid(position)) {
      throw Error('Invalid position. Non-integer values');
    }

    if (this.getWeight(position) === PATHFINDING_DEFAULT_TILE_WEIGHT) {
      return;
    }

    delete this.weights[position.y][position.x];

    this.pathfinding.events.send(PathfindingEvent.SetWeight, {
      idLayer: this.id,
      position,
      value: null,
    });
  }

  /**
   * Get tile weight.
   *
   * @param position - Tile position
   */
  public getWeight(position: PathfindingPoint): number {
    if (!this.isPointValid(position)) {
      throw Error('Invalid position. Non-integer values');
    }

    return this.weights[position.y]?.[position.x] ?? PATHFINDING_DEFAULT_TILE_WEIGHT;
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
    if (!this.isPointValid(config.from)) {
      throw Error('Invalid position \'from\'. Non-integer values');
    }

    if (!this.isPointValid(config.to)) {
      throw Error('Invalid position \'to\'. Non-integer values');
    }

    const id = ++this.lastTaskId;

    this.pathfinding.events.send(PathfindingEvent.CreateTask, {
      ...config,
      idLayer: this.id,
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
      idLayer: this.id,
      idTask: id,
    });

    this.handlers.delete(id);
  }

  private isPointValid(point: PathfindingPoint) {
    return (
      point.x === Math.round(point.x) &&
      point.y === Math.round(point.y)
    );
  }
}
