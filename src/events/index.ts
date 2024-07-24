import type { PathfindingEventPayload, PathfindingEventsParent } from './types';

export class PathfindingEvents {
  private listeners = new Map<string, (payload: any) => void>();

  private parent: PathfindingEventsParent;

  constructor(parent: PathfindingEventsParent) {
    this.parent = parent;

    this.parent.on('message', (data) => {
      this.listeners.get(data.event)?.(data.payload);
    });
  }

  public on<K extends keyof PathfindingEventPayload>(
    event: K,
    callback: (payload: PathfindingEventPayload[K]) => void,
  ) {
    this.listeners.set(event, callback);
  }

  public send<K extends keyof PathfindingEventPayload>(
    event: K,
    payload: PathfindingEventPayload[K],
  ) {
    this.parent.postMessage({ event, payload });
  }
}
