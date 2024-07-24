## 🧩 Pathfinding Worker
[![Version](https://badgen.net/npm/v/pathfinding-worker)](https://npmjs.com/package/pathfinding-worker)
[![Small size](https://img.badgesize.io/neki-dev/pathfinding-worker/main/dist/index.js)](https://github.com/neki-dev/pathfinding-worker/blob/main/dist/index.js)
[![Build](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml)
[![Test](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml)

Fast pathfinding in a separate node.js thread for grid-based games.

.

Documentation

* [Install](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#install)
* [General](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#general)
* [Layers](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#layers)
* [Finding](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#finding)
* [Tile walkable](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#tile-walkable)
* [Tile weight](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#tile-weight)

.

# Install

```sh
npm i pathfinding-worker
```

.

# General

### ⚡️ Create worker thread
```ts
const pathfinding = new Pathfinding(
  grid: Record<string, PathfindingGrid> | PathfindingGrid
)
```
[`grid`] - _Grid (or layers of grids) with walkable tiles_

### ⚡️ Terminate worker thread
```ts
pathfinding.destroy()
```

.

# Layers

### ⚡️ Add new layer of grid
```ts
pathfinding.addLayer(
  name: string, 
  grid: PathfindingGrid,
)
```
[`name`] - _Layer name_

[`grid`] - _Grid with walkable tiles_

### ⚡️ Get layer of grid
```ts
const layer = pathfinding.getLayer(
  name: string, 
)
```
[`name`] - _Layer name_

### ⚡️ Remove exist layer of grid
```ts
pathfinding.removeLayer(
  name: string, 
)
```
[`name`] - _Layer name_

.

# Finding

### ⚡️ Create pathfinder task
```ts
const idTask = pathfinder.createTask(
  config: PathfindingTaskConfig,
  callback: PathfindingTaskCallback,
)
```
[`config`] - _Task configuration_
 
| Prop | Description | Required |
| ---- | ----------- | ------- | 
| from | Begin tile position | yes |
| to | End tile position | yes |
| layer | Layer of grid if pathfinder has a few layers | - |

[`callback`] - _Callback with result_

### ⚡️ Cancel pathfinder task
```ts
pathfinder.cancelTask(id: number)
```
[`id`] - _Task id_

.

# Tile walkable

### ⚡️ Set walkable state
```ts
pathfinder.setWalkable(
  position: PathfindingPosition,
  value: number,
  layer?: string,
)
```
[`position`] - _Tile position_

[`state`] - _Walkable state_

[`layer`] - _Layer of grid if pathfinder has a few layers_

### ⚡️ Get walkable state
```ts
const walkable = pathfinder.isWalkable(
  position: PathfindingPosition,
)
```
[`position`] - _Tile position_

.

# Tile weight

### ⚡️ Set weight
```ts
pathfinder.setWeight(
  position: PathfindingPosition,
  value: number,
)
```
[`position`] - _Tile position_

[`value`] - _New weight_

### ⚡️ Reset weight
```ts
pathfinder.resetWeight(
  position: PathfindingPosition,
)
```
[`position`] - _Tile position_

### ⚡️ Get weight
```ts
const weight = pathfinder.getWeight(
  position: PathfindingPosition,
)
```
[`position`] - _Tile position_