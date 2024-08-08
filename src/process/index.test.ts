import { parentPort } from 'worker_threads';

import { mockedPath, mockedStraightPath } from './__mocks__/path';
import { mockGrid } from '../__mocks__/grid';
import { PathfindingTask } from '../task';

import { PathfindingProcess } from '.';

describe('PathfindingProcess', () => {
  let process: PathfindingProcess;

  beforeAll(() => {
    process = new PathfindingProcess();
    process.addLayer('layer1', mockGrid());
  });

  afterAll(() => {
    process.destroy();
  });

  beforeEach(() => {
    // @ts-ignore
    parentPort?.postMessage.mockClear();
  });

  it('should complete task', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idLayer: 'layer1',
      idTask: 1,
      from: { x: 6, y: 16 },
      to: { x: 7, y: 22 },
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      weight: 6,
      path: mockedPath,
    });
  });

  it('should complete task with straight directions', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idLayer: 'layer1',
      idTask: 1,
      from: { x: 6, y: 16 },
      to: { x: 7, y: 22 },
      diagonals: false,
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      weight: 7,
      path: mockedStraightPath,
    });
  });

  it('should complete task without path', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idLayer: 'layer1',
      idTask: 1,
      from: { x: 0, y: 0 },
      to: { x: 99, y: 99 },
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
