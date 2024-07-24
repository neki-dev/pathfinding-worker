// @ts-ignore
import PathfindingWorker from "worker-loader!./worker";
import { Worker } from "worker_threads";

import type { PathfindingTaskConfig, Position } from "./types";
import { PATHFINDING_WORKER_DIST_FILE_NAME } from "./const";
import type { PathfindingWorkerEventPayload } from "./worker/types";
import { PathfindingWorkerEvent } from "./worker/types";
import type { PathfindingTaskResultCallback } from "./task/types";

export class Pathfinding {
  readonly worker: Worker;

  private pointsCost: number[][] = [];

  private lastTaskId: number = 0;

  private resultCallbacks: Map<number, PathfindingTaskResultCallback> =
    new Map();

  constructor(grids: Record<string, boolean[][]>) {
    // Trigger webpack worker build
    void PathfindingWorker;

    this.worker = new Worker(PATHFINDING_WORKER_DIST_FILE_NAME, {
      workerData: { grids },
    });

    this.listen(PathfindingWorkerEvent.CompleteTask, (payload) => {
      const callback = this.getTaskCallback(payload.idTask);
      if (callback) {
        callback(payload.result);
      } else {
        // Events occurs for canceled tasks, since the path calculation occurs sequentially in single process.
        // Need to figure out how to interrupt the calculation for a canceled task.
      }
    });
  }

  public destroy(): void {
    this.worker.terminate();
  }

  public setWalkable(group: string, position: Position, state: boolean): void {
    this.send(PathfindingWorkerEvent.SetWalkable, {
      position,
      group,
      state,
    });
  }

  public setPointCost(position: Position, cost: number): void {
    if (this.getPointCost(position) === cost) {
      return;
    }

    if (!this.pointsCost[position.y]) {
      this.pointsCost[position.y] = [];
    }
    this.pointsCost[position.y][position.x] = cost;

    this.send(PathfindingWorkerEvent.UpdatePointCost, {
      position,
      cost,
    });
  }

  public resetPointCost(position: Position): void {
    if (this.pointsCost[position.y]?.[position.x] === undefined) {
      return;
    }

    delete this.pointsCost[position.y][position.x];

    this.send(PathfindingWorkerEvent.UpdatePointCost, {
      position,
      cost: null,
    });
  }

  public getPointCost(position: Position): number {
    return this.pointsCost[position.y]?.[position.x] ?? 1.0;
  }

  public createTask(
    config: PathfindingTaskConfig,
    callback: PathfindingTaskResultCallback,
  ): number {
    const idTask = ++this.lastTaskId;

    this.send(PathfindingWorkerEvent.CreateTask, {
      ...config,
      idTask,
    });

    this.resultCallbacks.set(idTask, callback);

    return idTask;
  }

  public getTaskCallback(idTask: number): PathfindingTaskResultCallback | null {
    return this.resultCallbacks.get(idTask) ?? null;
  }

  public cancelTask(idTask: number): void {
    this.send(PathfindingWorkerEvent.CancelTask, {
      idTask,
    });

    this.resultCallbacks.delete(idTask);
  }

  private listen<K extends keyof PathfindingWorkerEventPayload>(
    event: K,
    callback: (payload: PathfindingWorkerEventPayload[K]) => void,
  ): void {
    this.worker.on("message", (data) => {
      if (data.event === event) {
        callback(data.payload);
      }
    });
  }

  private send<K extends keyof PathfindingWorkerEventPayload>(
    event: K,
    payload: PathfindingWorkerEventPayload[K],
  ) {
    this.worker.postMessage({ event, payload });
  }
}
