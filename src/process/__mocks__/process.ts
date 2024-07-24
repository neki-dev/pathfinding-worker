import { PathfindingProcess } from '..';

import type { PathfindingGrid } from '../../types';

export const mockPathfindingProcess = (
  grid: Record<string, PathfindingGrid>,
) => (
  new PathfindingProcess(grid)
);
