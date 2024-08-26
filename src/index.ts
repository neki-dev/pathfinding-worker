import { Worker } from 'worker_threads';

import { PathfindingEvents } from './events';
import { PathfindingEvent } from './events/types';
import { PathfindingLayer } from './layer';
// Import pre-builded inline worker as string
import INLINE_WORKER from '../.tmp/worker.inline.js';

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
    loopRate,
    resourceLimits,
  }: PathfindingConfig = {}) {
    this.worker = new Worker(INLINE_WORKER, {
      name: 'pathfinding',
      eval: true,
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
