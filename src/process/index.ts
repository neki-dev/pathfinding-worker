import {
  PATHFINDING_PROCESS_LOOP_RATE,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL,
  PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT,
} from './const';

import type { PathfindingNode } from '../node';
import type { PathfindingTask } from '../task';
import type { PathfindingGrid, PathfindingPoint } from '../types';

/**
 * @internal
 */
export class PathfindingProcess {
  private readonly grids: Map<string, PathfindingGrid> = new Map();

  private readonly weights: Map<string, number[][]> = new Map();

  private queue: PathfindingTask[] = [];

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

  private next(): void {
    const task = this.queue[0];
    if (!task) {
      return;
    }

    const currentNode = task.takeLastNode();
    if (currentNode) {
      if (
        currentNode.position.x === task.to.x &&
        currentNode.position.y === task.to.y
      ) {
        this.queue.shift();
        task.complete(currentNode.compute());
      } else {
        this.getNextDirections(task, currentNode).forEach((offset) => {
          const position = {
            x: currentNode.position.x + offset.x,
            y: currentNode.position.y + offset.y,
          };
          const weights = this.weights.get(task.idLayer) ?? [];
          const nextWeight = task.getNextWeight(currentNode, offset, weights);
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
      this.queue.shift();
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
