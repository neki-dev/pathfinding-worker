import { mockGrid } from '../__mocks__/grid';
import { PathfindingEvent } from '../events/types';

import { Pathfinding } from '.';

describe('Pathfinding', () => {
  let pathfinding: Pathfinding;

  beforeEach(() => {
    pathfinding = new Pathfinding();
  });

  afterEach(async () => {
    await pathfinding.destroy();
  });

  describe('Layer', () => {
    describe('Add', () => {
      it('should add layer', () => {
        pathfinding.worker.postMessage = jest.fn();

        const grid = mockGrid();
        const layer = pathfinding.createLayer(grid);

        expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
          event: PathfindingEvent.AddLayer,
          payload: {
            idLayer: layer.id,
            grid,
          },
        });
      });

      it('should throw error with invalid grid', () => {
        let error = '';
        try {
          pathfinding.createLayer([
            [true, true, true],
            [true, true],
          ]);
        } catch (e) {
          error = (e as Error).message;
        }

        expect(error).toBe('Invalid grid. Different length of subarrays');
      });
    });

    describe('Remove', () => {
      it('should remove layer', () => {
        pathfinding.worker.postMessage = jest.fn();

        const grid = mockGrid();
        const layer = pathfinding.createLayer(grid);

        pathfinding.removeLayer(layer.id);

        expect(pathfinding.worker.postMessage).toHaveBeenCalledWith({
          event: PathfindingEvent.RemoveLayer,
          payload: {
            idLayer: layer.id,
          },
        });
      });

      it('should throw error with non-exist layer id', () => {
        let error = '';
        try {
          pathfinding.removeLayer('_id');
        } catch (e) {
          error = (e as Error).message;
        }

        expect(error).toBe('Layer with id \'_id\' is not found');
      });
    });
  });

  it('should terminate worker', () => {
    pathfinding.worker.terminate = jest.fn();

    pathfinding.destroy();

    expect(pathfinding.worker.terminate).toHaveBeenCalled();
  });
});
