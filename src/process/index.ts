import {
  PATHFINDING_PROCESS_LOOP_RATE,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT,
} from './const';

import type { PathfindingNode } from '../node';
import type { PathfindingTask } from '../task';
import type { PathfindingGrid, Position } from '../types';

export class PathfindingProcess {
  private grids: Record<string, PathfindingGrid>;

  private weights: number[][] = [];

  private taskQueue: PathfindingTask[] = [];

  private timer: NodeJS.Timeout;

  constructor(grids: Record<string, PathfindingGrid>) {
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

  public setWeight(position: Position, weight: number): void {
    if (!this.weights[position.y]) {
      this.weights[position.y] = [];
    }
    this.weights[position.y][position.x] = weight;
  }

  public resetWeight(position: Position): void {
    if (this.weights[position.y]) {
      delete this.weights[position.y][position.x];
    }
  }

  public setWalkable(layer: string, position: Position, state: boolean) {
    const grid = this.grids[layer];
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
          const nextWeight = task.getNextWeight(
            currentNode,
            offset,
            this.weights,
          );
          const nextNode = task.pickNode(position);

          if (nextNode) {
            if (nextWeight < nextNode.getWeight()) {
              task.useNode(currentNode, nextNode, nextWeight);
            }
          } else {
            task.addNode(currentNode, position, nextWeight);
          }
        });
      }
    } else {
      this.taskQueue.shift();
      task.complete({
        path: null,
        weight: Infinity,
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
        if (this.isWalkable(node, task.layer, direction)) {
          straightClear[key] = true;
          allowedDirs.push(direction);
        }
      },
    );

    Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL).forEach(
      ([key, direction]) => {
        const clear = straightClear[key[0]] && straightClear[key[1]];
        if (clear && this.isWalkable(node, task.layer, direction)) {
          allowedDirs.push(direction);
        }
      },
    );

    return allowedDirs;
  }

  private isWalkable(node: PathfindingNode, layer: string, direction: Position) {
    const position = {
      x: node.position.x + direction.x,
      y: node.position.y + direction.y,
    };
    return Boolean(this.grids[layer]?.[position.y]?.[position.x]);
  }
}
