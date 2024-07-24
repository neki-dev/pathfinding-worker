import { Pathfinding } from '..';

import type { PathfindingGrid } from '../types';

export const mockPathfinding = (
  grid: Record<string, PathfindingGrid> | PathfindingGrid,
) => {
  const pf = new Pathfinding(grid);
  pf.worker.postMessage = jest.fn();
  return pf;
};
