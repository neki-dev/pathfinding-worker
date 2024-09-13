import type { PathfindingTaskResult } from '../task/types';
import type { PathfindingGrid, PathfindingPoint } from '../types';

/**
 * @internal
 */
export enum PathfindingEvent {
  CreateTask = 'CreateTask',
  CompleteTask = 'CompleteTask',
  CancelTask = 'CancelTask',
  AddLayer = 'AddLayer',
  RemoveLayer = 'RemoveLayer',
  SetWalkable = 'SetWalkable',
  SetWeight = 'SetWeight',
}

/**
 * @internal
 */
export type PathfindingEventPayload = {
  [PathfindingEvent.CreateTask]: {
    idLayer: string;
    idTask: number;
    from: PathfindingPoint;
    to: PathfindingPoint;
    diagonals?: boolean;
  };
  [PathfindingEvent.CancelTask]: {
    idLayer: string;
    idTask: number;
  };
  [PathfindingEvent.SetWeight]: {
    idLayer: string;
    position: PathfindingPoint;
    value: number | null;
  };
  [PathfindingEvent.SetWalkable]: {
    idLayer: string;
    position: PathfindingPoint;
    state: boolean;
  };
  [PathfindingEvent.CompleteTask]: {
    idLayer: string;
    idTask: number;
    result: PathfindingTaskResult;
  };
  [PathfindingEvent.AddLayer]: {
    idLayer: string;
    grid: PathfindingGrid;
  };
  [PathfindingEvent.RemoveLayer]: {
    idLayer: string;
  };
};

/**
 * @internal
 */
export interface PathfindingEventsParent {
  on(event: 'message', callback: (body: PathfindingEventsBody) => void): void;
  postMessage(payload: Record<string, any>): void;
}

/**
 * @internal
 */
export type PathfindingEventsBody = {
  event: string;
  payload: Record<string, any>;
};
