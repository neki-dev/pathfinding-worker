import {
  PATHFINDING_PROCESS_LOOP_RATE,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT,
} from './const';

import type { PathfindingNode } from '../node';
import type { PathfindingTask } from '../task';
import type { PathfindingGrid, PathfindingPosition } from '../types';

export class PathfindingProcess {
  private readonly grids: Map<string, PathfindingGrid> = new Map();

  private readonly weights: Map<string, number[][]> = new Map();

  private taskQueue: PathfindingTask[] = [];

  private timer: NodeJS.Timeout;

  constructor(loopRate: number = PATHFINDING_PROCESS_LOOP_RATE) {
    this.timer = setInterval(() => {
      try {
        this.next();
      } catch (error) {
        console.error('Pathfinding process error:', error);
      }
    }, loopRate);
  }

  public destroy(): void {
    clearTimeout(this.timer);
  }

  public createTask(task: PathfindingTask): void {
    this.taskQueue.push(task);
  }

  public cancelTask(idLayer: string, idTask: number): void {
    const taskIndex = this.taskQueue.findIndex((task) => (
      task.idLayer === idLayer
      && task.id === idTask
    ));
    if (taskIndex !== -1) {
      this.taskQueue.splice(taskIndex, 1);
    }
  }

  public addLayer(idLayer: string, grid: PathfindingGrid): void {
    this.grids.set(idLayer, grid);
  }

  public removeLayer(idLayer: string): void {
    this.grids.delete(idLayer);
  }

  public setWeight(idLayer: string, position: PathfindingPosition, value: number): void {
    const weight = this.weights.get(idLayer);
    if (!weight) {
      return;
    }

    if (!weight[position.y]) {
      weight[position.y] = [];
    }
    weight[position.y][position.x] = value;
  }

  public resetWeight(idLayer: string, position: PathfindingPosition): void {
    const weight = this.weights.get(idLayer);
    if (!weight) {
      return;
    }

    if (weight[position.y]) {
      delete weight[position.y][position.x];
    }
  }

  public setWalkable(idLayer: string, position: PathfindingPosition, state: boolean) {
    const grid = this.grids.get(idLayer);
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
          const weights = this.weights.get(task.idLayer) ?? [];
          const nextWeight = task.getNextWeight(
            currentNode,
            offset,
            weights,
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
  ): PathfindingPosition[] {
    const straightClear: Record<string, boolean> = {};
    const allowedDirs: PathfindingPosition[] = [];

    Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT).forEach(
      ([key, direction]) => {
        if (this.isWalkable(task.idLayer, node, direction)) {
          straightClear[key] = true;
          allowedDirs.push(direction);
        }
      },
    );

    if (task.diagonals) {
      Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL).forEach(
        ([key, direction]) => {
          const clear = straightClear[key[0]] && straightClear[key[1]];
          if (clear && this.isWalkable(task.idLayer, node, direction)) {
            allowedDirs.push(direction);
          }
        },
      );
    }

    return allowedDirs;
  }

  private isWalkable(idLayer: string, node: PathfindingNode, direction: PathfindingPosition) {
    const grid = this.grids.get(idLayer);
    if (!grid) {
      return false;
    }

    const position = {
      x: node.position.x + direction.x,
      y: node.position.y + direction.y,
    };
    return Boolean(grid[position.y]?.[position.x]);
  }
}
