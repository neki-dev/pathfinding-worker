import { parentPort, workerData } from 'worker_threads';

import { PathfindingEvents } from '../events';
import { PathfindingEvent } from '../events/types';
import { PathfindingProcess } from '../process';
import { PathfindingTask } from '../task';

if (!parentPort) {
  throw Error('Undefined parent port of pathfinding worker');
}

const events = new PathfindingEvents(parentPort);
const process = new PathfindingProcess(workerData.grids);

events.on(PathfindingEvent.CreateTask, (payload) => {
  const task = new PathfindingTask(payload, (result) => {
    events.send(PathfindingEvent.CompleteTask, {
      idTask: payload.idTask,
      result,
    });
  });

  process.createTask(task);
});

events.on(PathfindingEvent.CancelTask, (payload) => {
  process.cancelTask(payload.idTask);
});

events.on(PathfindingEvent.SetWeight, (payload) => {
  if (payload.value === null) {
    process.resetWeight(payload.position);
  } else {
    process.setWeight(payload.position, payload.value);
  }
});

events.on(PathfindingEvent.SetWalkable, (payload) => {
  process.setWalkable(payload.layer, payload.position, payload.state);
});
