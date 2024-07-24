import type { Position } from "../types";
import type { PathfindingTaskResult } from "../task/types";
export declare enum PathfindingWorkerEvent {
    CreateTask = "CreateTask",
    CompleteTask = "CompleteTask",
    CancelTask = "CancelTask",
    UpdatePointCost = "UpdatePointCost",
    SetWalkable = "SetWalkable"
}
export type PathfindingWorkerEventPayload = {
    [PathfindingWorkerEvent.CreateTask]: {
        idTask: number;
        from: Position;
        to: Position;
        group: string;
    };
    [PathfindingWorkerEvent.CancelTask]: {
        idTask: number;
    };
    [PathfindingWorkerEvent.UpdatePointCost]: {
        position: Position;
        cost: number | null;
    };
    [PathfindingWorkerEvent.SetWalkable]: {
        position: Position;
        state: boolean;
        group: string;
    };
    [PathfindingWorkerEvent.CompleteTask]: {
        idTask: number;
        result: PathfindingTaskResult;
    };
};
