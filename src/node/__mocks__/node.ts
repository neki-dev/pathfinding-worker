import { PathfindingNode } from '..';

import type { PathfindingNodeConfig } from '../types';

export const mockNode = (config: PathfindingNodeConfig = {
  position: { x: 0, y: 0 },
  distance: 1,
}) => new PathfindingNode(config);
