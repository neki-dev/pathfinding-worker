import { MockedWorker } from '../__mocks__/worker';

const mock = () => {
  jest.mock('worker_threads', () => ({
    Worker: jest.fn(() => new MockedWorker()),
    parentPort: {
      postMessage: jest.fn(),
    },
  }));
};

mock();
setTimeout(mock);
