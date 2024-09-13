import { PathfindingNode } from '.';

describe('PathfindingNode', () => {
  let node: PathfindingNode;

  beforeEach(() => {
    node = new PathfindingNode({
      position: { x: 0, y: 0 },
      distance: 1.0,
    });
  });

  it('should return better guess distance', () => {
    expect(node.getBetterGuessDistance()).toBe(2);
  });

  it('should get current weight', () => {
    expect(node.getWeight()).toBe(1);
  });

  it('should get next weight', () => {
    expect(node.getNextWeight(({ x: 1, y: 0 }), [])).toBe(1);
    expect(node.getNextWeight(({ x: 1, y: 1 }), [])).toBe(1.4142135623730951);
    expect(node.getNextWeight(({ x: 1, y: 0 }), [[1, 2]])).toBe(2);
  });

  it('should change current weight', () => {
    node.setWeight(10);

    expect(node.getWeight()).toBe(10);
  });

  it('should change parent', () => {
    const parent = new PathfindingNode({
      position: { x: 1, y: 1 },
      distance: 1.0,
    });

    node.setParent(parent);

    expect(node.getParent()).toBe(parent);
  });

  it('should return result', () => {
    expect(node.compute()).toEqual({
      weight: 0,
      path: new Uint8Array([
        0, 0,
      ]),
    });
  });

  it('should return result with parent', () => {
    const parent = new PathfindingNode({
      position: { x: 1, y: 1 },
      distance: 1.0,
    });

    node.setParent(parent);

    expect(node.compute()).toEqual({
      weight: 1,
      path: new Uint8Array([
        1, 1,
        0, 0,
      ]),
    });
  });
});
