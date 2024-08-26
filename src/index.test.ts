import { mockGrid } from './__mocks__/grid';
import { PathfindingEvent } from './events/types';

import { Pathfinding } from '.';

import type { PathfindingLayer } from './layer';

describe('Pathfinding', () => {
  let pathfinding: Pathfinding;
  let layer: PathfindingLayer;

  beforeEach(() => {
    pathfinding = new Pathfinding();
    layer = pathfinding.createLayer(mockGrid());
  });

  afterEach(async () => {
    await pathfinding.destroy();
  });

  describe('Layers', () => {
    it('should add layer', () => {
      const grid = mockGrid();
      const secondLayer = pathfinding.createLayer(grid);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.AddLayer,
        payload: {
          idLayer: secondLayer.uuid,
          grid,
        },
      });
    });

    it('should remove layer', () => {
      layer.remove();

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.RemoveLayer,
        payload: {
          idLayer: layer.uuid,
        },
      });
    });
  });

  describe('Task', () => {
    it('should create task', () => {
      const idTask = layer.findPath({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, jest.fn());

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.CreateTask,
        payload: {
          idLayer: layer.uuid,
          idTask,
          from: { x: 0, y: 0 },
          to: { x: 100, y: 100 },
        },
      });
    });

    it('should cancel task', () => {
      const idTask = layer.findPath({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, jest.fn());

      layer.cancel(idTask);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.CancelTask,
        payload: {
          idLayer: layer.uuid,
          idTask,
        },
      });
    });

    it('should call callback when task has been completed', () => {
      const callback = jest.fn();
      const idTask = layer.findPath({
        from: { x: 0, y: 0 },
        to:  { x: 100, y: 100 },
      }, callback);

      pathfinding.worker.emit('message', {
        event: PathfindingEvent.CompleteTask,
        payload: {
          idLayer: layer.uuid,
          idTask,
        },
      });

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Tile walkable', () => {
    it('should get walkable', () => {
      expect(layer.isWalkable({ x: 0, y: 0 })).toBe(true);
      expect(layer.isWalkable({ x: 5, y: 5 })).toBe(false);
    });

    it('should set walkable', () => {
      layer.setWalkable({ x: 0, y: 0 }, false);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.SetWalkable,
        payload: {
          idLayer: layer.uuid,
          position: { x: 0, y: 0 },
          state: false,
        },
      });
    });
  });

  describe('Tile weight', () => {
    it('should get weight', () => {
      layer.setWeight({ x: 0, y: 0 }, 10);

      expect(layer.getWeight({ x: 0, y: 0 })).toBe(10);
    });

    it('should set weight', () => {
      layer.setWeight({ x: 0, y: 0 }, 10);

      expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
        event: PathfindingEvent.SetWeight,
        payload: {
          idLayer: layer.uuid,
          position: { x: 0, y: 0 },
          value: 10,
        },
      });
    });

    it('should reset weight', () => {
      layer.setWeight({ x: 0, y: 0 }, 10);
      layer.resetWeight({ x: 0, y: 0 });

      expect(layer.getWeight({ x: 0, y: 0 })).toBe(1);
    });
  });

  it('should terminate worker', () => {
    pathfinding.worker.terminate = jest.fn();

    pathfinding.destroy();

    expect(pathfinding.worker.terminate).toHaveBeenCalled();
  });
});
