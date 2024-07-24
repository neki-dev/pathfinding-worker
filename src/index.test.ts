import { mockGrid } from './__mocks__/grid';
import { PathfindingEvent } from './events/types';

import { Pathfinding } from '.';

describe('Pathfinding', () => {
  let pathfinding: Pathfinding;

  beforeEach(() => {
    pathfinding = new Pathfinding();
    pathfinding.addLayer('layer1', mockGrid());
  });

  afterEach(async () => {
    await pathfinding.destroy();
  });

  describe('Layers', () => {
    it('should add layer', () => {
      const grid = mockGrid();
      pathfinding.addLayer('layer2', grid);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.AddLayer,
        payload: {
          layer: 'layer2',
          grid,
        },
      });
    });

    it('should remove layer', () => {
      pathfinding.removeLayer('layer1');

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.RemoveLayer,
        payload: {
          layer: 'layer1',
        },
      });
    });
  });

  describe('Task', () => {
    it('should create task', () => {
      const idTask = pathfinding.createTask({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
        layer: 'layer1',
      }, jest.fn());

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
        layer: 'layer1',
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
        layer: 'layer1',
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
      expect(pathfinding.isWalkable('layer1', { x: 0, y: 0 })).toBe(true);
      expect(pathfinding.isWalkable('layer1', { x: 5, y: 5 })).toBe(false);
    });

    it('should set walkable', () => {
      pathfinding.setWalkable('layer1', { x: 0, y: 0 }, false);

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
        pathfinding.setWalkable('layer2', { x: 0, y: 0 }, false);
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
