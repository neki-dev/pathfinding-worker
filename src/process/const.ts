export const PATHFINDING_PROCESS_LOOP_RATE = 200;

export const PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT = {
  R: { x: 1, y: 0 }, // →
  L: { x: -1, y: 0 }, // ←
  D: { x: 0, y: 1 }, // ↓
  U: { x: 0, y: -1 }, // ↑
};

export const PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL = {
  RD: { x: 1, y: 1 }, // ↘
  RU: { x: 1, y: -1 }, // ↗
  LU: { x: -1, y: -1 }, // ↖
  LD: { x: -1, y: 1 }, // ↙
};
