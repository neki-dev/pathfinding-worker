import { mockGrid } from './__mocks__/grid';
import { mockPathfinding } from './__mocks__/pathfinding';
import { PATHFINDING_DEFUALT_LAYER } from './const';
import { PathfindingEvent } from './events/types';

import type { Pathfinding } from '.';

describe('Pathfinding', () => {
  let pathfinding: Pathfinding;

  beforeEach(() => {
    pathfinding = mockPathfinding(mockGrid());
  });

  describe('Layers', () => {
  });

  describe('Task', () => {
    it('should create task', () => {
      const resultCallback = jest.fn();
      const idTask = pathfinding.createTask({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, resultCallback);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.CreateTask,
        payload: {
          idTask,
          from: { x: 0, y: 0 },
          to: { x: 100, y: 100 },
          layer: PATHFINDING_DEFUALT_LAYER,
        },
      });
    });

    it('should create task with layers', () => {
      pathfinding = mockPathfinding({
        'layer1': mockGrid(),
      });

      const resultCallback = jest.fn();
      const idTask = pathfinding.createTask({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
        layer: 'layer1',
      }, resultCallback);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.CreateTask,
        payload: {
          idTask,
          from: { x: 0, y: 0 },
          to: { x: 100, y: 100 },
          layer: 'layer1',
        },
      });
    });

    it('should throw error if layer is not found', () => {
      let error = '';
      try {
        pathfinding.createTask({
          from: { x: 0, y: 0 },
          to:  { x: 100, y: 100 },
          layer: 'layer2',
        }, jest.fn());
      } catch (e) {
        error = (e as Error).message;
      }

      expect(error).toBe('Layer of pathfinding grid \'layer2\' is not found');
    });

    it('should cancel task', () => {
      const idTask = pathfinding.createTask({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, jest.fn());

      pathfinding.cancelTask(idTask);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.CancelTask,
        payload: { idTask },
      });
    });

    it('should throw error if task is not found', () => {
      let error = '';
      try {
        pathfinding.cancelTask(999);
      } catch (e) {
        error = (e as Error).message;
      }

      expect(error).toBe('Pathfinding task with id \'999\' is not found');
    });

    it('should call callback when task has been completed', () => {
      const callback = jest.fn();
      const idTask = pathfinding.createTask({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, callback);

      pathfinding.worker.emit('message', {
        event: PathfindingEvent.CompleteTask,
        payload: { idTask },
      });

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Tile walkable', () => {
    it('should get walkable', () => {
      expect(pathfinding.isWalkable({ x: 0, y: 0 })).toBe(true);
      expect(pathfinding.isWalkable({ x: 5, y: 5 })).toBe(false);
    });

    it('should set walkable', () => {
      pathfinding.setWalkable({ x: 0, y: 0 }, false);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.SetWalkable,
        payload: {
          layer: PATHFINDING_DEFUALT_LAYER,
          position: { x: 0, y: 0 },
          state: false,
        },
      });
    });

    it('should set walkable for specified layer', () => {
      pathfinding = mockPathfinding({
        'layer1': mockGrid(),
      });
      pathfinding.setWalkable({ x: 0, y: 0 }, false, 'layer1');

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.SetWalkable,
        payload: {
          layer: 'layer1',
          position: { x: 0, y: 0 },
          state: false,
        },
      });
    });

    it('should throw error if layer is not found', () => {
      let error = '';
      try {
        pathfinding.setWalkable({ x: 0, y: 0 }, false, 'layer2');
      } catch (e) {
        error = (e as Error).message;
      }

      expect(error).toBe('Layer of pathfinding grid \'layer2\' is not found');
    });
  });

  describe('Tile weight', () => {
    it('should get weight', () => {
      pathfinding.setWeight({ x: 0, y: 0 }, 10);

      expect(pathfinding.getWeight({ x: 0, y: 0 })).toBe(10);
    });

    it('should set weight', () => {
      pathfinding.setWeight({ x: 0, y: 0 }, 10);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.SetWeight,
        payload: {
          position: { x: 0, y: 0 },
          value: 10,
        },
      });
    });

    it('should reset weight', () => {
      pathfinding.setWeight({ x: 0, y: 0 }, 10);
      pathfinding.resetWeight({ x: 0, y: 0 });

      expect(pathfinding.getWeight({ x: 0, y: 0 })).toBe(1);
    });
  });

  it('should terminate worker', () => {
    pathfinding.worker.terminate = jest.fn();

    pathfinding.destroy();

    expect(pathfinding.worker.terminate).toHaveBeenCalled();
  });
});
