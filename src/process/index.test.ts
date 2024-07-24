import { parentPort } from 'worker_threads';

import { mockedGrid } from '../__mocks__/grid';
import { mockedPath } from './__mocks__/path';
import { PathfindingTask } from '../task';

import { PathfindingProcess } from '.';

describe('PathfindingProcess', () => {
  let process: PathfindingProcess;

  beforeAll(() => {
    process = new PathfindingProcess({
      'groupA': mockedGrid,
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
      group: 'groupA',
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      cost: 6,
      path: mockedPath,
    });
  });

  it('should complete task without path', () => {
    const callback = jest.fn();
    const task = new PathfindingTask({
      idTask: 1,
      from: { x: 0, y: 0 },
      to: { x: 99, y: 99 },
      group: 'groupA',
    }, callback);

    process.createTask(task);
    // @ts-ignore: Emitate remote call
    process.next();

    expect(callback).toHaveBeenCalledWith({
      cost: Infinity,
      path: null,
    });
  });
});
