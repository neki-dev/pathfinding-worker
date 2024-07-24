import type { PathfindingEventPayload, PathfindingEventsParent } from './types';
export declare class PathfindingEvents {
    private listeners;
    private parent;
    constructor(parent: PathfindingEventsParent);
    on<K extends keyof PathfindingEventPayload>(event: K, callback: (payload: PathfindingEventPayload[K]) => void): void;
    send<K extends keyof PathfindingEventPayload>(event: K, payload: PathfindingEventPayload[K]): void;
}
