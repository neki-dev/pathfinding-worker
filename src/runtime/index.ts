import fs from 'fs';
import path from 'path';

// Import pre-builded inline worker as string
import INLINE_WORKER from '../../.temp/worker.inline.js';

export class PathfindingRuntime {
  public readonly workerPath: string;

  constructor(workerPath: string) {
    this.workerPath = path.resolve(__dirname, workerPath);
  }

  public workerExists() {
    return fs.existsSync(this.workerPath);
  }

  public createWorker() {
    fs.writeFileSync(this.workerPath, INLINE_WORKER);
  }
}
