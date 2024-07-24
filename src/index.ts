// @ts-ignore
import PathfindingWorker from 'worker-loader!./worker';
import { Worker } from 'worker_threads';

import {
  PATHFINDING_DEFUALT_LAYER,
  PATHFINDING_WORKER_DIST_FILE_NAME,
} from './const';
import { PathfindingEvents } from './events';
import { PathfindingEvent } from './events/types';

import type { PathfindingTaskCallback } from './task/types';
import type { PathfindingGrid, PathfindingTaskConfig, Position } from './types';

export class Pathfinding {
  public readonly worker: Worker;

  private weights: number[][] = [];

  private layers: Record<string, PathfindingGrid>;

  private lastTaskId: number = 0;

  private resultCallbacks: Map<number, PathfindingTaskCallback> = new Map();

  private readonly events: PathfindingEvents;

  /**
   * Spawn pathfinding worker thread.
   *
   * @param grid - Grid (or layers of grid) with walkable tiles. Order of indexes is grid[y][x]
   */
  constructor(grid: Record<string, PathfindingGrid> | PathfindingGrid) {
    // Trigger webpack worker build
    void PathfindingWorker;

    this.layers = Array.isArray(grid)
      ? { [PATHFINDING_DEFUALT_LAYER]: grid }
      : grid;

    this.worker = new Worker(PATHFINDING_WORKER_DIST_FILE_NAME, {
      workerData: {
        layers: this.layers,
      },
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
  public destroy(): void {
    this.worker.terminate();
  }

  /**
   * Add a new layer grid.
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
   * Get layer grid.
   *
   * @param layer - Layer name
   */
  public getLayer(layer: string): PathfindingGrid {
    return this.layers[layer] ?? null;
  }

  /**
   * Remove exist layer grid.
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
   * @param position - Tile position
   * @param state - Walkable state
   * @param layer - Layer of grid if pathfinder has a few layers
   */
  public setWalkable(position: Position, state: boolean, layer = PATHFINDING_DEFUALT_LAYER): void {
    if (!this.layers[layer]) {
      throw Error(`Layer of pathfinding grid '${layer}' is not found`);
    }

    if (this.isWalkable(position, layer) === state) {
      console.log('curr', this.isWalkable(position, layer));
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
   * @param position - Tile position
   * @param layer - Layer of grid if pathfinder has a few layers
   */
  public isWalkable(position: Position, layer = PATHFINDING_DEFUALT_LAYER): boolean {
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
  public setWeight(position: Position, value: number): void {
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
  public resetWeight(position: Position): void {
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
  public getWeight(position: Position): number {
    return this.weights[position.y]?.[position.x] ?? 1.0;
  }

  /**
   * Create a new task to find path between two tiles.
   *
   * @param config - Task configuration
   * @param callback - Callback with result path
   *
   * @returns Id of created task
   */
  public createTask(
    config: PathfindingTaskConfig,
    callback: PathfindingTaskCallback,
  ): number {
    const layer = config.layer ?? PATHFINDING_DEFUALT_LAYER;

    if (!this.layers[layer]) {
      throw Error(`Layer of pathfinding grid '${layer}' is not found`);
    }

    const idTask = ++this.lastTaskId;

    this.events.send(PathfindingEvent.CreateTask, {
      ...config,
      layer,
      idTask,
    });

    this.resultCallbacks.set(idTask, callback);

    return idTask;
  }

  /**
   * Cancel exist task by id.
   *
   * @param idTask - Task id
   */
  public cancelTask(idTask: number): void {
    if (!this.resultCallbacks.has(idTask)) {
      throw Error(`Pathfinding task with id '${idTask}' is not found`);
    }

    this.events.send(PathfindingEvent.CancelTask, {
      idTask,
    });

    this.resultCallbacks.delete(idTask);
  }
}
