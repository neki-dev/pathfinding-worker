import type { PathfindingTaskResult } from '../task/types';
import type { PathfindingGrid, Position } from '../types';

export enum PathfindingEvent {
  CreateTask = 'CreateTask',
  CompleteTask = 'CompleteTask',
  CancelTask = 'CancelTask',
  AddLayer = 'AddLayer',
  RemoveLayer = 'RemoveLayer',
  SetWalkable = 'SetWalkable',
  SetWeight = 'SetWeight',
}

export type PathfindingEventPayload = {
  [PathfindingEvent.CreateTask]: {
    idTask: number;
    from: Position;
    to: Position;
    layer?: string;
  };
  [PathfindingEvent.CancelTask]: {
    idTask: number;
  };
  [PathfindingEvent.SetWeight]: {
    position: Position;
    value: number | null;
  };
  [PathfindingEvent.SetWalkable]: {
    position: Position;
    state: boolean;
    layer: string;
  };
  [PathfindingEvent.CompleteTask]: {
    idTask: number;
    result: PathfindingTaskResult;
  };
  [PathfindingEvent.AddLayer]: {
    layer: string;
    grid: PathfindingGrid;
  };
  [PathfindingEvent.RemoveLayer]: {
    layer: string;
  };
};

export interface PathfindingEventsParent {
  on(event: 'message', callback: (body: PathfindingEventsBody) => void): void;
  postMessage(payload: Record<string, any>): void;
}

export type PathfindingEventsBody = {
  event: string;
  payload: Record<string, any>;
};
