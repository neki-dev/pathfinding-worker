import { parentPort } from 'worker_threads';

import { mockedPath } from './__mocks__/path';
import { mockPathfindingProcess } from './__mocks__/process';
import { mockGrid } from '../__mocks__/grid';
import { PathfindingTask } from '../task';

import type { PathfindingProcess } from '.';

describe('PathfindingProcess', () => {
  let process: PathfindingProcess;

  beforeAll(() => {
    process = mockPathfindingProcess({
      'layerA': mockGrid(),
    });
  });

  afterAll(() => {
    process.destroy();
  });

  beforeEach(() => {
    // @ts-ignore
    parentPort?.postMessage.mockClear();
  });

  it('should complete task with path', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idTask: 1,
      from: { x: 6, y: 16 },
      to: { x: 7, y: 22 },
      layer: 'layerA',
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      weight: 6,
      path: mockedPath,
    });
  });

  it('should complete task without path', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idTask: 1,
      from: { x: 0, y: 0 },
      to: { x: 99, y: 99 },
      layer: 'layerA',
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      weight: Infinity,
      path: null,
    });
  });
});
