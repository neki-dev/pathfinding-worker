import {
  PATHFINDING_PROCESS_LOOP_RATE,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT,
} from "./const";

import type { Position } from "../types";
import type { PathfindingNode } from "../node";
import type { PathfindingTask } from "../task";

export class PathfindingProcess {
  private grids: Record<string, boolean[][]>;

  private pointsCost: number[][] = [];

  private taskQueue: PathfindingTask[] = [];

  private timer: NodeJS.Timeout;

  constructor(grids: Record<string, boolean[][]>) {
    this.grids = grids;
    this.timer = setInterval(() => {
      try {
        this.next();
      } catch (error) {
        console.error(error);
      }
    }, PATHFINDING_PROCESS_LOOP_RATE);
  }

  public destroy(): void {
    clearTimeout(this.timer);
  }

  public createTask(task: PathfindingTask): void {
    this.taskQueue.push(task);
  }

  public cancelTask(idTask: number): void {
    const taskIndex = this.taskQueue.findIndex((task) => task.id === idTask);
    if (taskIndex !== -1) {
      this.taskQueue.splice(taskIndex, 1);
    }
  }

  public setPointCost(position: Position, cost: number): void {
    if (!this.pointsCost[position.y]) {
      this.pointsCost[position.y] = [];
    }
    this.pointsCost[position.y][position.x] = cost;
  }

  public resetPointCost(position: Position): void {
    if (this.pointsCost[position.y]) {
      delete this.pointsCost[position.y][position.x];
    }
  }

  public setWalkable(group: string, position: Position, state: boolean) {
    const grid = this.grids[group];
    if (!grid) {
      return;
    }

    grid[position.y][position.x] = state;
  }

  private next(): void {
    const task = this.taskQueue[0];
    if (!task) {
      return;
    }

    const currentNode = task.takeLastNode();
    if (currentNode) {
      if (
        currentNode.position.x === task.to.x &&
        currentNode.position.y === task.to.y
      ) {
        this.taskQueue.shift();
        task.complete(currentNode.compute());
      } else {
        this.getNextDirections(task, currentNode).forEach((offset) => {
          const position = {
            x: currentNode.position.x + offset.x,
            y: currentNode.position.y + offset.y,
          };
          const nextCost = task.getNextCost(
            currentNode,
            offset,
            this.pointsCost,
          );
          const nextNode = task.pickNode(position);

          if (nextNode) {
            if (nextCost < nextNode.getCost()) {
              task.useNode(currentNode, nextNode, nextCost);
            }
          } else {
            task.addNode(currentNode, position, nextCost);
          }
        });
      }
    } else {
      this.taskQueue.shift();
      task.complete({
        path: null,
        cost: Infinity,
      });
    }

    this.next();
  }

  private getNextDirections(
    task: PathfindingTask,
    node: PathfindingNode,
  ): Position[] {
    const straightClear: Record<string, boolean> = {};
    const allowedDirs: Position[] = [];

    Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT).forEach(
      ([key, direction]) => {
        if (this.isWalkable(node, task.group, direction)) {
          straightClear[key] = true;
          allowedDirs.push(direction);
        }
      },
    );

    Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL).forEach(
      ([key, direction]) => {
        const clear = straightClear[key[0]] && straightClear[key[1]];
        if (clear && this.isWalkable(node, task.group, direction)) {
          allowedDirs.push(direction);
        }
      },
    );

    return allowedDirs;
  }

  private isWalkable(node: PathfindingNode, group: string, direction: Position) {
    const position = {
      x: node.position.x + direction.x,
      y: node.position.y + direction.y,
    };
    return this.grids[group]?.[position.y]?.[position.x];
  }
}
