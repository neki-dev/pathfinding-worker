import { mockedPath, mockedStraightPath } from './__mocks__/path';
import { Pathfinding } from '..';
import { mockGrid } from '../__mocks__/grid';
import { PathfindingEvent } from '../events/types';

import type { PathfindingLayer } from '.';

describe('PathfindingLayer', () => {
  let pathfinding: Pathfinding;
  let layer: PathfindingLayer;

  beforeEach(() => {
    pathfinding = new Pathfinding();
    layer = pathfinding.createLayer(mockGrid());
  });

  afterEach(async () => {
    await pathfinding.destroy();
  });

  describe('Tile', () => {
    describe('Walkable', () => {
      it('should get walkable', () => {
        expect(layer.isWalkable({ x: 0, y: 0 })).toBe(true);
        expect(layer.isWalkable({ x: 5, y: 5 })).toBe(false);
      });

      it('should set walkable', () => {
        pathfinding.worker.postMessage = jest.fn();

        layer.setWalkable({ x: 0, y: 0 }, false);

        expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
          event: PathfindingEvent.SetWalkable,
          payload: {
            idLayer: layer.id,
            position: { x: 0, y: 0 },
            state: false,
          },
        });
      });

      it('should throw error with non-integer position', () => {
        let error = '';
        try {
          layer.setWalkable({ x: 0.56, y: 0.34 }, false);
        } catch (e) {
          error = (e as Error).message;
        }

        expect(error).toBe('Invalid position. Non-integer values');
      });
    });

    describe('Weight', () => {
      it('should get weight', () => {
        layer.setWeight({ x: 0, y: 0 }, 10);

        expect(layer.getWeight({ x: 0, y: 0 })).toBe(10);
      });

      it('should set weight', () => {
        pathfinding.worker.postMessage = jest.fn();

        layer.setWeight({ x: 0, y: 0 }, 10);

        expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
          event: PathfindingEvent.SetWeight,
          payload: {
            idLayer: layer.id,
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

      it('should throw error with non-integer position', () => {
        let error = '';
        try {
          layer.setWeight({ x: 0.56, y: 0.34 }, 10);
        } catch (e) {
          error = (e as Error).message;
        }

        expect(error).toBe('Invalid position. Non-integer values');
      });
    });
  });

  describe('Task', () => {
    it('should return result with all directions', async () => {
      const result = await new Promise((resolve) => {
        layer.findPath({
          from: { x: 6, y: 16 },
          to: { x: 7, y: 22 },
        }, resolve);
      });

      expect(result).toEqual({
        weight: 6,
        path: mockedPath,
      });
    });

    it('should return result with straight directions', async () => {
      const result = await new Promise((resolve) => {
        layer.findPath({
          from: { x: 6, y: 16 },
          to: { x: 7, y: 22 },
          diagonals: false,
        }, resolve);
      });

      expect(result).toEqual({
        weight: 7,
        path: mockedStraightPath,
      });
    });

    it('should return empty result if unnable to find path', async () => {
      const result = await new Promise((resolve) => {
        layer.findPath({
          from: { x: 0, y: 0 },
          to: { x: 99, y: 99 },
        }, resolve);
      });

      expect(result).toEqual({
        weight: Infinity,
        path: null,
      });
    });

    it('should throw error with non-integer position \'from\'', () => {
      let error = '';
      try {
        layer.findPath({
          from: { x: 0.45, y: 0 },
          to:  { x: 100, y: 100 },
        }, jest.fn());
      } catch (e) {
        error = (e as Error).message;
      }

      expect(error).toBe('Invalid position \'from\'. Non-integer values');
    });

    it('should throw error with non-integer position \'to\'', () => {
      let error = '';
      try {
        layer.findPath({
          from: { x: 0, y: 0 },
          to:  { x: 100, y: 100.10 },
        }, jest.fn());
      } catch (e) {
        error = (e as Error).message;
      }

      expect(error).toBe('Invalid position \'to\'. Non-integer values');
    });

    describe('Cancel', () => {
      it('should cancel task', () => {
        pathfinding.worker.postMessage = jest.fn();

        const idTask = layer.findPath({
          from: { x: 0, y: 0 },
          to:  { x: 100, y: 100 },
        }, jest.fn());

        layer.cancel(idTask);

        expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
          event: PathfindingEvent.CancelTask,
          payload: {
            idLayer: layer.id,
            idTask,
          },
        });
      });

      it('should throw error with non-exist task id', () => {
        let error = '';
        try {
          layer.cancel(0xf);
        } catch (e) {
          error = (e as Error).message;
        }

        expect(error).toBe(`Pathfinding task with id '${0xf}' is not found`);
      });
    });
  });
});
