import { parentPort, workerData } from "worker_threads";

import { PathfindingProcess } from "../process";
import { PathfindingTask } from "../task";
import type { PathfindingWorkerEventPayload } from "./types";
import { PathfindingWorkerEvent } from "./types";

const listeners = new Map<string, (payload: any) => void>();
const process = new PathfindingProcess(workerData.grids);

listen(PathfindingWorkerEvent.CreateTask, (payload) => {
  const task = new PathfindingTask(payload, (result) => {
    send(PathfindingWorkerEvent.CompleteTask, {
      idTask: payload.idTask,
      result,
    });
  });

  process.createTask(task);
});

listen(PathfindingWorkerEvent.CancelTask, (payload) => {
  process.cancelTask(payload.idTask);
});

listen(PathfindingWorkerEvent.UpdatePointCost, (payload) => {
  if (payload.cost === null) {
    process.resetPointCost(payload.position);
  } else {
    process.setPointCost(payload.position, payload.cost);
  }
});

listen(PathfindingWorkerEvent.SetWalkable, (payload) => {
  process.setWalkable(payload.group, payload.position, payload.state);
});

parentPort?.on("message", (data) => {
  listeners.get(data.event)?.(data.payload);
});

function listen<K extends keyof PathfindingWorkerEventPayload>(
  event: K,
  callback: (payload: PathfindingWorkerEventPayload[K]) => void,
) {
  listeners.set(event, callback);
}

function send<K extends keyof PathfindingWorkerEventPayload>(
  event: K,
  payload: PathfindingWorkerEventPayload[K],
) {
  parentPort?.postMessage({ event, payload });
}
