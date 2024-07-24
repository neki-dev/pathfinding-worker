import EventEmitter from 'events';

export class MockedWorker extends EventEmitter {
  postMessage = jest.fn();
  terminate = jest.fn();
}
