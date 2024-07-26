## 🧩 Pathfinding Worker
[![Version](https://badgen.net/npm/v/pathfinding-worker)](https://npmjs.com/package/pathfinding-worker)
[![Small size](https://img.badgesize.io/neki-dev/pathfinding-worker/main/dist/index.js)](https://github.com/neki-dev/pathfinding-worker/blob/main/dist/index.js)
[![Build](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml)
[![Test](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml)

Fast node.js pathfinding on workers for grid-based games.

.

Documentation

* [Install](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#install)
* [General](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#general)
* [Layers](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#layers)
* [Finding](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#finding)
* [Tile walkable](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#tile-walkable)
* [Tile weight](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#tile-weight)
* [Example](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#example)

.

## Install

```sh
npm i pathfinding-worker
```

.

## General

### ⚡️ Create worker thread
```ts
const pathfinding = new Pathfinding(
  config: PathfindingConfig
)
```
* `config` - _Pathfinding configuration_
 
| Prop | Description | Default |
| ---- | ----------- | ------- | 
| loopRate | Finding loop rate | 200 ms |
| workerPath | Custom path to worker file | ./pathfinder.worker.js |
| runtime | Create worker script in runtime mode | true |

### ⚡️ Terminate worker thread
```ts
pathfinding.destroy()
```

.

## Layers

### ⚡️ Add new layer of grid
```ts
pathfinding.addLayer(
  name: string, 
  grid: PathfindingGrid,
)
```
* `name` - _Layer name_
* `grid` - _Grid with walkable tiles_

### ⚡️ Get layer of grid
```ts
const layer = pathfinding.getLayer(
  name: string, 
)
```
* `name` - _Layer name_

### ⚡️ Remove exist layer of grid
```ts
pathfinding.removeLayer(
  name: string, 
)
```
* `name` - _Layer name_

.

## Finding

### ⚡️ Create pathfinder task
```ts
const idTask = pathfinder.createTask(
  config: PathfindingTaskConfig,
  callback: PathfindingTaskCallback,
)
```
* `config` - _Task configuration_
 
| Prop | Description | Default |
| ---- | ----------- | ------- |
| layer | Layer of grid | |
| from | Begin tile position | |
| to | End tile position | |
| diagonals | Allow diagonal directions | true |

* `callback` - _Callback with result_

### ⚡️ Cancel pathfinder task
```ts
pathfinder.cancelTask(id: number)
```
* `id` - _Task id_

.

## Tile walkable

### ⚡️ Set walkable state
```ts
pathfinder.setWalkable(
  layer: string,
  position: PathfindingPosition,
  value: number,
)
```
* `layer` - _Layer of grid_
* `position` - _Tile position_
* `state` - _Walkable state_

### ⚡️ Get walkable state
```ts
const walkable = pathfinder.isWalkable(
  layer: string,
  position: PathfindingPosition,
)
```
* `layer` - _Layer of grid_
* `position` - _Tile position_

.

## Tile weight

### ⚡️ Set weight
```ts
pathfinder.setWeight(
  position: PathfindingPosition,
  value: number,
)
```
* `position` - _Tile position_
* `value` - _New weight_

### ⚡️ Reset weight
```ts
pathfinder.resetWeight(
  position: PathfindingPosition,
)
```
* `position` - _Tile position_

### ⚡️ Get weight
```ts
const weight = pathfinder.getWeight(
  position: PathfindingPosition,
)
```
* `position` - _Tile position_

.

## Example

```ts
const pathfinding = new Pathfinding({
  loopRate: 500,
});

pathfinding.addLayer('basic', [
  [true, true,  true,  true],
  [true, true,  false, true],
  [true, false, false, true],
  [true, false, false, false],
]);

pathfinder.createTask({
  layer: 'basic',
  from: { x: 0, y: 0 },
  to: { x: 3, y: 2 },
}, ({ path, cost }) => {
  console.log('Result path:', path);
  console.log('Total cost:', cost);
})
```
