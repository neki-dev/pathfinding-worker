import { Pathfinding } from '..';

import type { PathfindingConfig } from '../types';

export const mockPathfinding = (
  config?: PathfindingConfig,
) => {
  const pf = new Pathfinding(config);
  pf.worker.postMessage = jest.fn();
  return pf;
};
