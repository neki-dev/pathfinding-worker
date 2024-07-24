import { mockNode } from './__mocks__/node';

import type { PathfindingNode } from '.';

describe('PathfindingNode', () => {
  let node: PathfindingNode;

  beforeEach(() => {
    node = mockNode();
  });

  it('should return better guess distance', () => {
    expect(node.getBetterGuessDistance()).toBe(2);
  });

  it('should get current cost', () => {
    expect(node.getCost()).toBe(1);
  });

  it('should get next cost', () => {
    expect(node.getNextCost(({ x: 1, y: 0 }), [])).toBe(1);
    expect(node.getNextCost(({ x: 1, y: 1 }), [])).toBe(1.4142135623730951);
    expect(node.getNextCost(({ x: 1, y: 0 }), [[1, 2]])).toBe(2);
  });

  it('should change current cost', () => {
    node.setCost(10);

    expect(node.getCost()).toBe(10);
  });

  it('should change parent', () => {
    const parent = mockNode();

    node.setParent(parent);

    expect(node.getParent()).toBe(parent);
  });

  it('should return result', () => {
    expect(node.compute()).toEqual({
      cost: 0,
      path: [{ x: 0, y: 0 }],
    });
  });

  it('should return result with parent', () => {
    const parent = mockNode({
      position: ({ x: 1, y: 1 }),
      distance: 1,
    });

    node.setParent(parent);

    expect(node.compute()).toEqual({
      cost: 1,
      path: [{ x: 1, y: 1 }, { x: 0, y: 0 }],
    });
  });
});
