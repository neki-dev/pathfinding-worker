import type { NavigatorNode } from ".";
import { Position } from "../../types";
export type NavigatorNodeConfig = {
    position: Position;
    distance: number;
    cost?: number;
    parent?: NavigatorNode | null;
};
export type NavigatorNodeResult = {
    path: Position[];
    cost: number;
};
