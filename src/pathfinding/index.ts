import { Worker } from 'worker_threads';

import INLINE_WORKER from '../../.temp/worker.inline.js';
import { PathfindingEvents } from '../events';
import { PathfindingEvent } from '../events/types';
import { PathfindingLayer } from '../layer';

import type { PathfindingConfig } from './types';
import type { PathfindingGrid, PathfindingPoint } from '../types';

export class Pathfinding {
  public readonly worker: Worker;

  public readonly events: PathfindingEvents;

  private readonly layers: Map<string, PathfindingLayer> = new Map();

  /**
   * Create pathfinding worker thread.
   *
   * @param config - Pathfinding configuration
   */
  constructor({ loopRate, resourceLimits }: PathfindingConfig = {}) {
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

      callback({
        weight: result.weight,
        path: result.path && (
          Pathfinding.unflatPath(result.path)
        ),
      });

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
    for (let i = 1; i < grid.length; i++) {
      if (grid[0].length !== grid[i].length) {
        throw Error('Invalid grid. Different length of subarrays');
      }
    }

    const layer = new PathfindingLayer(this, grid);
    this.layers.set(layer.id, layer);

    this.events.send(PathfindingEvent.AddLayer, {
      idLayer: layer.id,
      grid,
    });

    return layer;
  }

  /**
   * Check for layer presence.
   *
   * @param id - Layer id
   */
  public hasLayer(id: string): boolean {
    return this.layers.has(id);
  }

  /**
   * Remove layer of grid.
   *
   * @param id - Layer id
   */
  public removeLayer(id: string): void {
    if (!this.hasLayer(id)) {
      throw Error(`Layer with id '${id}' is not found`);
    }

    this.layers.delete(id);

    this.events.send(PathfindingEvent.RemoveLayer, {
      idLayer: id,
    });
  }

  private static unflatPath(path: Uint8Array) {
    const result: PathfindingPoint[] = [];
    for (let i = 0; i < path.length - 1; i += 2) {
      result.push({
        x: path[i],
        y: path[i + 1],
      });
    }

    return result;
  }
}
