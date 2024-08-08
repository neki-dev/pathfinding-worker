import { Worker } from 'worker_threads';

import { PATHFINDING_DEFUALT_WORKER_FILE_NAME } from './const';
import { PathfindingEvents } from './events';
import { PathfindingEvent } from './events/types';
import { PathfindingLayer } from './layer';
import { PathfindingRuntime } from './runtime';

import type { PathfindingGrid, PathfindingConfig } from './types';

export class Pathfinding {
  public readonly worker: Worker;

  public readonly events: PathfindingEvents;

  private readonly layers: Map<string, PathfindingLayer> = new Map();

  /**
   * Create pathfinding worker thread.
   *
   * @param config - Pathfinding configuration
   */
  constructor({
    runtime = true,
    workerPath = PATHFINDING_DEFUALT_WORKER_FILE_NAME,
    loopRate,
    resourceLimits,
  }: PathfindingConfig = {}) {
    const pr = new PathfindingRuntime(workerPath);
    if (runtime && !pr.workerExists()) {
      pr.createWorker();
    }

    this.worker = new Worker(pr.workerPath, {
      name: 'pathfinding',
      workerData: { loopRate },
      resourceLimits,
    });

    this.events = new PathfindingEvents(this.worker);

    this.events.on(PathfindingEvent.CompleteTask, ({ idLayer, idTask, result }) => {
      const layer = this.layers.get(idLayer);
      if (!layer) {
        // Layer was deleted before the task was completed.
        return;
      }

      const callback = layer.handlers.get(idTask);
      if (!callback) {
        // The task was canceled.
        // Need to figure out how to interrupt the calculation for a canceled task.
        return;
      }

      callback(result);
      layer.handlers.delete(idTask);
    });
  }

  /**
   * Terminate worker thread.
   */
  public destroy(): Promise<number> {
    return this.worker.terminate();
  }

  /**
   * Create a new layer of grid.
   *
   * @param grid - Grid with walkable tiles
   */
  public createLayer(grid: PathfindingGrid): PathfindingLayer {
    const layer = new PathfindingLayer(this, grid);
    this.layers.set(layer.uuid, layer);

    this.events.send(PathfindingEvent.AddLayer, {
      idLayer: layer.uuid,
      grid,
    });

    return layer;
  }

  /**
   * Remove layer of grid.
   *
   * @param id - Layer id
   */
  public removeLayer(id: string): void {
    if (!this.layers.has(id)) {
      return;
    }

    this.layers.delete(id);

    this.events.send(PathfindingEvent.RemoveLayer, {
      idLayer: id,
    });
  }
}
