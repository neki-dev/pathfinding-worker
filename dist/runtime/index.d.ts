export declare class PathfindingRuntime {
    readonly workerPath: string;
    constructor(workerPath: string);
    workerExists(): boolean;
    createWorker(): void;
}
