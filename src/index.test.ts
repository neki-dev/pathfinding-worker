import { Pathfinding } from ".";

import { mockedGrid } from './__mocks__/grid';
import { PathfindingWorkerEvent } from "./worker/types";

describe('Pathfinding', () => {
  let pathfinding: Pathfinding;

  beforeEach(() => {
    pathfinding = new Pathfinding({
      'groupA': mockedGrid,
    });
    pathfinding.worker.postMessage = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    pathfinding.worker.postMessage.mockClear();
    pathfinding.destroy();
  });

  it('should create task', () => {
    const resultCallback = jest.fn();
    const idTask = pathfinding.createTask({
      from: { x: 0, y: 0 },
      to:  { x: 100, y: 100 },
      group: 'groupA',
    }, resultCallback);

    expect(pathfinding.getTaskCallback(idTask)).toBe(resultCallback);
    expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
      event: PathfindingWorkerEvent.CreateTask,
      payload: {
        idTask,
        from: { x: 0, y: 0 },
        to: { x: 100, y: 100 },
        group: 'groupA',
      },
    });
  });

  it('should cancel task', () => {
    const idTask = 1;

    pathfinding.cancelTask(idTask);

    expect(pathfinding.getTaskCallback(idTask)).toBe(null);
    expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
      event: PathfindingWorkerEvent.CancelTask,
      payload: { idTask },
    });
  });

  it('should recieve task result', () => {
    const resultCallback = jest.fn();
    const idTask = pathfinding.createTask({
      from: { x: 0, y: 0 },
      to:  { x: 100, y: 100 },
      group: 'groupA',
    }, resultCallback);

    pathfinding.worker.emit('message', {
      event: PathfindingWorkerEvent.CompleteTask,
      payload: { idTask },
    });

    expect(resultCallback).toHaveBeenCalled();
  });

  it('should set point cost', () => {
    pathfinding.setPointCost({ x: 0, y: 0 }, 10);

    expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
      event: PathfindingWorkerEvent.UpdatePointCost,
      payload: {
        position: { x: 0, y: 0 },
        cost: 10,
      },
    });
  });

  it('should reset point cost', () => {
    pathfinding.setPointCost({ x: 0, y: 0 }, 10);
    pathfinding.resetPointCost({ x: 0, y: 0 });

    expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
      event: PathfindingWorkerEvent.UpdatePointCost,
      payload: {
        position: { x: 0, y: 0 },
        cost: null,
      },
    });
  });

  it('should destroy', () => {
    pathfinding.worker.terminate = jest.fn();

    pathfinding.destroy();

    expect(pathfinding.worker.terminate).toHaveBeenCalled();
  });
});
