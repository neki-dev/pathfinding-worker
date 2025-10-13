import {
  PATHFINDING_PROCESS_LOOP_RATE,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT,
  PATHFINDING_PROCESS_TASK_HANDLING_MAX_STACK_SIZE,
} from './const';

import type { PathfindingProcessConfig } from './types';
import type { PathfindingNode } from '../node';
import type { PathfindingTask } from '../task';
import type { PathfindingTaskResultRaw } from '../task/types';
import type { PathfindingGrid, PathfindingPoint } from '../types';

/**
 * @internal
 */
export class PathfindingProcess {
  private readonly grids: Map<string, PathfindingGrid> = new Map();

  private readonly weights: Map<string, number[][]> = new Map();

  private queue: PathfindingTask[] = [];

  private readonly timer: NodeJS.Timeout;

  private processing: boolean = false;

  constructor({
    loopRate = PATHFINDING_PROCESS_LOOP_RATE,
  }: PathfindingProcessConfig) {
    this.timer = setInterval(() => {
      try {
        if (!this.processing) {
          this.processing = true;
          this.handleTask();
        }
      } catch (error) {
        console.error('Pathfinding process error:', error);
      }
    }, loopRate);
  }

  public destroy(): void {
    clearTimeout(this.timer);
  }

  public createTask(task: PathfindingTask): void {
    this.queue.push(task);
  }

  public cancelTask(idLayer: string, idTask: number): void {
    const taskIndex = this.queue.findIndex(
      (task) => task.idLayer === idLayer && task.id === idTask,
    );
    if (taskIndex !== -1) {
      this.queue.splice(taskIndex, 1);
    }
  }

  public createLayer(idLayer: string, grid: PathfindingGrid): void {
    this.grids.set(idLayer, grid);
    this.weights.set(idLayer, []);
  }

  public removeLayer(idLayer: string): void {
    this.grids.delete(idLayer);
    this.weights.delete(idLayer);
  }

  public setWeight(
    idLayer: string,
    position: PathfindingPoint,
    value: number | null,
  ): void {
    const weight = this.weights.get(idLayer);
    if (!weight) {
      return;
    }

    if (value === null) {
      if (weight[position.y]) {
        delete weight[position.y][position.x];
      }
    } else {
      if (!weight[position.y]) {
        weight[position.y] = [];
      }
      weight[position.y][position.x] = value;
    }
  }

  public setWalkable(
    idLayer: string,
    position: PathfindingPoint,
    state: boolean,
  ) {
    const grid = this.grids.get(idLayer);
    if (!grid) {
      return;
    }

    grid[position.y][position.x] = state;
  }

  private handleTask(stackSize: number = 0): void {
    const task = this.queue[0];
    if (!task) {
      this.processing = false;
      return;
    }

    const next = () => {
      if (stackSize >= PATHFINDING_PROCESS_TASK_HANDLING_MAX_STACK_SIZE) {
        setTimeout(() => {
          this.handleTask();
        });
      } else {
        this.handleTask(stackSize + 1);
      }
    };

    const complete = (result: PathfindingTaskResultRaw) => {
      this.queue.shift();
      task.complete(result);
      this.processing = false;
    };

    try {
      const currentNode = task.takeLastNode();
      if (!currentNode) {
        return complete({
          path: null,
          weight: Infinity,
        });
      }

      if (task.isVisited(currentNode.position)) {
        return next();
      }

      task.markVisited(currentNode.position);

      if (
        currentNode.position.x === task.to.x &&
        currentNode.position.y === task.to.y
      ) {
        return complete(currentNode.compute());
      }

      this.getNextDirections(task, currentNode).forEach((offset) => {
        const position = {
          x: currentNode.position.x + offset.x,
          y: currentNode.position.y + offset.y,
        };

        if (task.isVisited(position)) {
          return;
        }

        const weights = this.weights.get(task.idLayer) ?? [];
        const nextWeight = task.getNextWeight(currentNode, offset, weights);
        const nextNode = task.pickNode(position);

        if (nextNode) {
          if (nextWeight < nextNode.getWeight()) {
            task.rewriteNode(currentNode, nextNode, nextWeight);
          }
        } else {
          task.addNode(currentNode, position, nextWeight);
        }
      });

      next();
    } catch (error) {
      console.error('Pathfinding handle task error:', error);
      complete({
        path: null,
        weight: Infinity,
      });
    }
  }

  private getNextDirections(
    task: PathfindingTask,
    node: PathfindingNode,
  ): PathfindingPoint[] {
    const directions: PathfindingPoint[] = [];
    const clears: Set<string> = new Set();

    Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT).forEach(
      ([key, direction]) => {
        if (this.isWalkable(task.idLayer, node, direction)) {
          clears.add(key);
          directions.push(direction);
        }
      },
    );

    if (task.diagonals) {
      Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL).forEach(
        ([key, direction]) => {
          const clear = clears.has(key[0]) && clears.has(key[1]);
          if (clear && this.isWalkable(task.idLayer, node, direction)) {
            directions.push(direction);
          }
        },
      );
    }

    return directions;
  }

  private isWalkable(
    idLayer: string,
    node: PathfindingNode,
    direction: PathfindingPoint,
  ) {
    const grid = this.grids.get(idLayer);
    if (!grid) {
      return false;
    }

    const y = node.position.y + direction.y;
    const x = node.position.x + direction.x;

    return Boolean(grid[y]?.[x]);
  }
}
