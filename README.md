## 🧩 Pathfinding Worker
[![Version](https://badgen.net/npm/v/pathfinding-worker)](https://npmjs.com/package/pathfinding-worker)
[![Small size](https://img.badgesize.io/neki-dev/pathfinding-worker/main/dist/index.js)](https://github.com/neki-dev/pathfinding-worker/blob/main/dist/index.js)
[![Build](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/build.yml)
[![Test](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml/badge.svg)](https://github.com/neki-dev/pathfinding-worker/actions/workflows/test.yml)

Fast node.js pathfinding on workers for grid-based games.

.

Documentation

* [Install](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#install)
* [Configuration](https://github.com/neki-dev/pathfinding-worker?tab=readme-ov-file#configuration)
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

# Configuration

### ⚡️ Store module worker
Add new entry in your webpack.config to store module worker in project dist. Or you may use [webpack 5 workers import](https://webpack.js.org/guides/web-workers/) / [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/)
```ts
// ... webpack.config.js
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].js',
},
entry: {
  // ...
  // Add new entry
  'pathfinding.worker': path.resolve(
    __dirname, 
    'node_modules/pathfinder-worker/dist/worker.js',
  ),
},
```

.

# General

### ⚡️ Create worker thread
```ts
const pathfinding = new Pathfinding(
  config: PathfindingConfig
)
```
* `config` - _Pathfinding configuration_
 
| Prop | Description | Default |
| ---- | ----------- | ------- | 
| rate | Finding loop rate | 200 ms |
| workerPath | Path to worker file | ./pathfinder.worker.js |

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

# Finding

### ⚡️ Create pathfinder task
```ts
const idTask = pathfinder.createTask(
  config: PathfindingTaskConfig,
  callback: PathfindingTaskCallback,
)
```
* `config` - _Task configuration_
 
| Prop | Description |
| ---- | ----------- |
| layer | Layer of grid |
| from | Begin tile position |
| to | End tile position |

* `callback` - _Callback with result_

### ⚡️ Cancel pathfinder task
```ts
pathfinder.cancelTask(id: number)
```
* `id` - _Task id_

.

# Tile walkable

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

# Tile weight

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