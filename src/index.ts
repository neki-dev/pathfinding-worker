import { Worker } from 'worker_threads';

import { PATHFINDING_DEFUALT_WORKER_FILE_NAME } from './const';
import { PathfindingEvents } from './events';
import { PathfindingEvent } from './events/types';
import { PathfindingRuntime } from './runtime';

import type { PathfindingTaskCallback } from './task/types';
import type { PathfindingGrid, PathfindingTaskConfig, PathfindingPosition, PathfindingConfig } from './types';

export class Pathfinding {
  public readonly worker: Worker;

  private weights: number[][] = [];

  private layers: Record<string, PathfindingGrid> = {};

  private lastTaskId: number = 0;

  private resultCallbacks: Map<number, PathfindingTaskCallback> = new Map();

  private readonly events: PathfindingEvents;

  /**
   * Create pathfinding worker thread.
   *
   * @param config - Pathfinding configuration
   */
  constructor({
    runtime = true,
    workerPath = PATHFINDING_DEFUALT_WORKER_FILE_NAME,
    loopRate,
  }: PathfindingConfig = {}) {
    const pr = new PathfindingRuntime(workerPath);
    if (runtime && !pr.workerExists()) {
      pr.createWorker();
    }

    this.worker = new Worker(pr.workerPath, {
      workerData: { loopRate },
    });

    this.events = new PathfindingEvents(this.worker);

    this.events.on(PathfindingEvent.CompleteTask, ({ idTask, result }) => {
      const callback = this.resultCallbacks.get(idTask);
      if (callback) {
        callback(result);
        this.resultCallbacks.delete(idTask);
      } else {
        // Events occurs for canceled tasks, since the path calculation occurs sequentially in single process.
        // Need to figure out how to interrupt the calculation for a canceled task.
      }
    });
  }

  /**
   * Terminate worker thread.
   */
  public destroy(): Promise<number> {
    return this.worker.terminate();
  }

  /**
   * Add new layer of grid.
   *
   * @param layer - Layer name
   * @param grid - Grid with walkable tiles
   */
  public addLayer(layer: string, grid: PathfindingGrid): void {
    this.layers[layer] = grid;

    this.events.send(PathfindingEvent.AddLayer, {
      layer,
      grid,
    });
  }

  /**
   * Get layer of grid.
   *
   * @param layer - Layer name
   */
  public getLayer(layer: string): PathfindingGrid {
    return this.layers[layer] ?? null;
  }

  /**
   * Remove exist layer of grid.
   *
   * @param layer - Layer name
   */
  public removeLayer(layer: string): void {
    if (!this.layers[layer]) {
      throw Error(`Layer of pathfinding grid '${layer}' is not found`);
    }

    delete this.layers[layer];

    this.events.send(PathfindingEvent.RemoveLayer, {
      layer,
    });
  }

  /**
   * Update walkable state of tile.
   *
   * @param layer - Layer of grid
   * @param position - Tile position
   * @param state - Walkable state
   */
  public setWalkable(layer: string, position: PathfindingPosition, state: boolean): void {
    if (!this.layers[layer]) {
      throw Error(`Layer of pathfinding grid '${layer}' is not found`);
    }

    if (this.isWalkable(layer, position) === state) {
      return;
    }

    if (!this.layers[layer][position.y]) {
      this.layers[layer][position.y] = [];
    }
    this.layers[layer][position.y][position.x] = state;

    this.events.send(PathfindingEvent.SetWalkable, {
      position,
      layer,
      state,
    });
  }

  /**
   * Get walkable state of tile.
   *
   * @param layer - Layer of grid
   * @param position - Tile position
   */
  public isWalkable(layer: string, position: PathfindingPosition): boolean {
    if (!this.layers[layer]) {
      throw Error(`Layer of pathfinding grid '${layer}' is not found`);
    }

    return Boolean(this.layers[layer][position.y]?.[position.x]);
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

    this.events.send(PathfindingEvent.SetWeight, {
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

    this.events.send(PathfindingEvent.SetWeight, {
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
  public createTask(
    config: PathfindingTaskConfig,
    callback: PathfindingTaskCallback,
  ): number {
    if (!this.layers[config.layer]) {
      throw Error(`Layer of pathfinding grid '${config.layer}' is not found`);
    }

    const id = ++this.lastTaskId;

    this.events.send(PathfindingEvent.CreateTask, {
      ...config,
      idTask: id,
    });

    this.resultCallbacks.set(id, callback);

    return id;
  }

  /**
   * Cancel exist task by id.
   *
   * @param id - Task id
   */
  public cancelTask(id: number): void {
    if (!this.resultCallbacks.has(id)) {
      throw Error(`Pathfinding task with id '${id}' is not found`);
    }

    this.events.send(PathfindingEvent.CancelTask, {
      idTask: id,
    });

    this.resultCallbacks.delete(id);
  }
}
