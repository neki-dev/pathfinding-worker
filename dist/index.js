(()=>{var n={232:n=>{n.exports='/******/ (() => { // webpackBootstrap\n/******/ \tvar __webpack_modules__ = ({\n\n/***/ 731:\n/***/ ((module, __unused_webpack_exports, __webpack_require__) => {\n\nmodule.exports = __webpack_require__(297);\n\n\n/***/ }),\n\n/***/ 297:\n/***/ (function(module, exports) {\n\nvar __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0\n(function() {\n  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;\n\n  floor = Math.floor, min = Math.min;\n\n\n  /*\n  Default comparison function to be used\n   */\n\n  defaultCmp = function(x, y) {\n    if (x < y) {\n      return -1;\n    }\n    if (x > y) {\n      return 1;\n    }\n    return 0;\n  };\n\n\n  /*\n  Insert item x in list a, and keep it sorted assuming a is sorted.\n  \n  If x is already in a, insert it to the right of the rightmost x.\n  \n  Optional args lo (default 0) and hi (default a.length) bound the slice\n  of a to be searched.\n   */\n\n  insort = function(a, x, lo, hi, cmp) {\n    var mid;\n    if (lo == null) {\n      lo = 0;\n    }\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    if (lo < 0) {\n      throw new Error(\'lo must be non-negative\');\n    }\n    if (hi == null) {\n      hi = a.length;\n    }\n    while (lo < hi) {\n      mid = floor((lo + hi) / 2);\n      if (cmp(x, a[mid]) < 0) {\n        hi = mid;\n      } else {\n        lo = mid + 1;\n      }\n    }\n    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);\n  };\n\n\n  /*\n  Push item onto heap, maintaining the heap invariant.\n   */\n\n  heappush = function(array, item, cmp) {\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    array.push(item);\n    return _siftdown(array, 0, array.length - 1, cmp);\n  };\n\n\n  /*\n  Pop the smallest item off the heap, maintaining the heap invariant.\n   */\n\n  heappop = function(array, cmp) {\n    var lastelt, returnitem;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    lastelt = array.pop();\n    if (array.length) {\n      returnitem = array[0];\n      array[0] = lastelt;\n      _siftup(array, 0, cmp);\n    } else {\n      returnitem = lastelt;\n    }\n    return returnitem;\n  };\n\n\n  /*\n  Pop and return the current smallest value, and add the new item.\n  \n  This is more efficient than heappop() followed by heappush(), and can be\n  more appropriate when using a fixed size heap. Note that the value\n  returned may be larger than item! That constrains reasonable use of\n  this routine unless written as part of a conditional replacement:\n      if item > array[0]\n        item = heapreplace(array, item)\n   */\n\n  heapreplace = function(array, item, cmp) {\n    var returnitem;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    returnitem = array[0];\n    array[0] = item;\n    _siftup(array, 0, cmp);\n    return returnitem;\n  };\n\n\n  /*\n  Fast version of a heappush followed by a heappop.\n   */\n\n  heappushpop = function(array, item, cmp) {\n    var _ref;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    if (array.length && cmp(array[0], item) < 0) {\n      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];\n      _siftup(array, 0, cmp);\n    }\n    return item;\n  };\n\n\n  /*\n  Transform list into a heap, in-place, in O(array.length) time.\n   */\n\n  heapify = function(array, cmp) {\n    var i, _i, _j, _len, _ref, _ref1, _results, _results1;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    _ref1 = (function() {\n      _results1 = [];\n      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }\n      return _results1;\n    }).apply(this).reverse();\n    _results = [];\n    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {\n      i = _ref1[_i];\n      _results.push(_siftup(array, i, cmp));\n    }\n    return _results;\n  };\n\n\n  /*\n  Update the position of the given item in the heap.\n  This function should be called every time the item is being modified.\n   */\n\n  updateItem = function(array, item, cmp) {\n    var pos;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    pos = array.indexOf(item);\n    if (pos === -1) {\n      return;\n    }\n    _siftdown(array, 0, pos, cmp);\n    return _siftup(array, pos, cmp);\n  };\n\n\n  /*\n  Find the n largest elements in a dataset.\n   */\n\n  nlargest = function(array, n, cmp) {\n    var elem, result, _i, _len, _ref;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    result = array.slice(0, n);\n    if (!result.length) {\n      return result;\n    }\n    heapify(result, cmp);\n    _ref = array.slice(n);\n    for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n      elem = _ref[_i];\n      heappushpop(result, elem, cmp);\n    }\n    return result.sort(cmp).reverse();\n  };\n\n\n  /*\n  Find the n smallest elements in a dataset.\n   */\n\n  nsmallest = function(array, n, cmp) {\n    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    if (n * 10 <= array.length) {\n      result = array.slice(0, n).sort(cmp);\n      if (!result.length) {\n        return result;\n      }\n      los = result[result.length - 1];\n      _ref = array.slice(n);\n      for (_i = 0, _len = _ref.length; _i < _len; _i++) {\n        elem = _ref[_i];\n        if (cmp(elem, los) < 0) {\n          insort(result, elem, 0, null, cmp);\n          result.pop();\n          los = result[result.length - 1];\n        }\n      }\n      return result;\n    }\n    heapify(array, cmp);\n    _results = [];\n    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {\n      _results.push(heappop(array, cmp));\n    }\n    return _results;\n  };\n\n  _siftdown = function(array, startpos, pos, cmp) {\n    var newitem, parent, parentpos;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    newitem = array[pos];\n    while (pos > startpos) {\n      parentpos = (pos - 1) >> 1;\n      parent = array[parentpos];\n      if (cmp(newitem, parent) < 0) {\n        array[pos] = parent;\n        pos = parentpos;\n        continue;\n      }\n      break;\n    }\n    return array[pos] = newitem;\n  };\n\n  _siftup = function(array, pos, cmp) {\n    var childpos, endpos, newitem, rightpos, startpos;\n    if (cmp == null) {\n      cmp = defaultCmp;\n    }\n    endpos = array.length;\n    startpos = pos;\n    newitem = array[pos];\n    childpos = 2 * pos + 1;\n    while (childpos < endpos) {\n      rightpos = childpos + 1;\n      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {\n        childpos = rightpos;\n      }\n      array[pos] = array[childpos];\n      pos = childpos;\n      childpos = 2 * pos + 1;\n    }\n    array[pos] = newitem;\n    return _siftdown(array, startpos, pos, cmp);\n  };\n\n  Heap = (function() {\n    Heap.push = heappush;\n\n    Heap.pop = heappop;\n\n    Heap.replace = heapreplace;\n\n    Heap.pushpop = heappushpop;\n\n    Heap.heapify = heapify;\n\n    Heap.updateItem = updateItem;\n\n    Heap.nlargest = nlargest;\n\n    Heap.nsmallest = nsmallest;\n\n    function Heap(cmp) {\n      this.cmp = cmp != null ? cmp : defaultCmp;\n      this.nodes = [];\n    }\n\n    Heap.prototype.push = function(x) {\n      return heappush(this.nodes, x, this.cmp);\n    };\n\n    Heap.prototype.pop = function() {\n      return heappop(this.nodes, this.cmp);\n    };\n\n    Heap.prototype.peek = function() {\n      return this.nodes[0];\n    };\n\n    Heap.prototype.contains = function(x) {\n      return this.nodes.indexOf(x) !== -1;\n    };\n\n    Heap.prototype.replace = function(x) {\n      return heapreplace(this.nodes, x, this.cmp);\n    };\n\n    Heap.prototype.pushpop = function(x) {\n      return heappushpop(this.nodes, x, this.cmp);\n    };\n\n    Heap.prototype.heapify = function() {\n      return heapify(this.nodes, this.cmp);\n    };\n\n    Heap.prototype.updateItem = function(x) {\n      return updateItem(this.nodes, x, this.cmp);\n    };\n\n    Heap.prototype.clear = function() {\n      return this.nodes = [];\n    };\n\n    Heap.prototype.empty = function() {\n      return this.nodes.length === 0;\n    };\n\n    Heap.prototype.size = function() {\n      return this.nodes.length;\n    };\n\n    Heap.prototype.clone = function() {\n      var heap;\n      heap = new Heap();\n      heap.nodes = this.nodes.slice(0);\n      return heap;\n    };\n\n    Heap.prototype.toArray = function() {\n      return this.nodes.slice(0);\n    };\n\n    Heap.prototype.insert = Heap.prototype.push;\n\n    Heap.prototype.top = Heap.prototype.peek;\n\n    Heap.prototype.front = Heap.prototype.peek;\n\n    Heap.prototype.has = Heap.prototype.contains;\n\n    Heap.prototype.copy = Heap.prototype.clone;\n\n    return Heap;\n\n  })();\n\n  (function(root, factory) {\n    if (true) {\n      return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === \'function\' ?\n\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n    } else {}\n  })(this, function() {\n    return Heap;\n  });\n\n}).call(this);\n\n\n/***/ })\n\n/******/ \t});\n/************************************************************************/\n/******/ \t// The module cache\n/******/ \tvar __webpack_module_cache__ = {};\n/******/ \t\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/ \t\t// Check if module is in cache\n/******/ \t\tvar cachedModule = __webpack_module_cache__[moduleId];\n/******/ \t\tif (cachedModule !== undefined) {\n/******/ \t\t\treturn cachedModule.exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = __webpack_module_cache__[moduleId] = {\n/******/ \t\t\t// no module.id needed\n/******/ \t\t\t// no module.loaded needed\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/ \t\n/******/ \t\t// Execute the module function\n/******/ \t\t__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/ \t\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/compat get default export */\n/******/ \t(() => {\n/******/ \t\t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t\t__webpack_require__.n = (module) => {\n/******/ \t\t\tvar getter = module && module.__esModule ?\n/******/ \t\t\t\t() => (module[\'default\']) :\n/******/ \t\t\t\t() => (module);\n/******/ \t\t\t__webpack_require__.d(getter, { a: getter });\n/******/ \t\t\treturn getter;\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tfor(var key in definition) {\n/******/ \t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nvar __webpack_exports__ = {};\n// This entry need to be wrapped in an IIFE because it need to be in strict mode.\n(() => {\n"use strict";\n\n;// CONCATENATED MODULE: external "worker_threads"\nconst external_worker_threads_namespaceObject = require("worker_threads");\n;// CONCATENATED MODULE: ./src/events/index.ts\nclass PathfindingEvents {\n    listeners = new Map();\n    parent;\n    constructor(parent) {\n        this.parent = parent;\n        this.parent.on(\'message\', (data) => {\n            this.listeners.get(data.event)?.(data.payload);\n        });\n    }\n    on(event, callback) {\n        this.listeners.set(event, callback);\n    }\n    send(event, payload) {\n        this.parent.postMessage({ event, payload });\n    }\n}\n\n;// CONCATENATED MODULE: ./src/events/types.ts\nvar PathfindingEvent;\n(function (PathfindingEvent) {\n    PathfindingEvent["CreateTask"] = "CreateTask";\n    PathfindingEvent["CompleteTask"] = "CompleteTask";\n    PathfindingEvent["CancelTask"] = "CancelTask";\n    PathfindingEvent["AddLayer"] = "AddLayer";\n    PathfindingEvent["RemoveLayer"] = "RemoveLayer";\n    PathfindingEvent["SetWalkable"] = "SetWalkable";\n    PathfindingEvent["SetWeight"] = "SetWeight";\n})(PathfindingEvent || (PathfindingEvent = {}));\n\n;// CONCATENATED MODULE: ./src/process/const.ts\nconst PATHFINDING_PROCESS_LOOP_RATE = 200;\nconst PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT = {\n    R: { x: 1, y: 0 }, // →\n    L: { x: -1, y: 0 }, // ←\n    D: { x: 0, y: 1 }, // ↓\n    U: { x: 0, y: -1 }, // ↑\n};\nconst PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL = {\n    RD: { x: 1, y: 1 }, // ↘\n    RU: { x: 1, y: -1 }, // ↗\n    LU: { x: -1, y: -1 }, // ↖\n    LD: { x: -1, y: 1 }, // ↙\n};\n\n;// CONCATENATED MODULE: ./src/process/index.ts\n\nclass PathfindingProcess {\n    grids = new Map();\n    weights = new Map();\n    queue = [];\n    timer;\n    constructor(loopRate = PATHFINDING_PROCESS_LOOP_RATE) {\n        this.timer = setInterval(() => {\n            try {\n                this.next();\n            }\n            catch (error) {\n                console.error(\'Pathfinding process error:\', error);\n            }\n        }, loopRate);\n    }\n    destroy() {\n        clearTimeout(this.timer);\n    }\n    createTask(task) {\n        this.queue.push(task);\n    }\n    cancelTask(idLayer, idTask) {\n        const taskIndex = this.queue.findIndex((task) => task.idLayer === idLayer && task.id === idTask);\n        if (taskIndex !== -1) {\n            this.queue.splice(taskIndex, 1);\n        }\n    }\n    addLayer(idLayer, grid) {\n        this.grids.set(idLayer, grid);\n    }\n    removeLayer(idLayer) {\n        this.grids.delete(idLayer);\n    }\n    setWeight(idLayer, position, value) {\n        const weight = this.weights.get(idLayer);\n        if (!weight) {\n            return;\n        }\n        if (value === null) {\n            if (weight[position.y]) {\n                delete weight[position.y][position.x];\n            }\n        }\n        else {\n            if (!weight[position.y]) {\n                weight[position.y] = [];\n            }\n            weight[position.y][position.x] = value;\n        }\n    }\n    setWalkable(idLayer, position, state) {\n        const grid = this.grids.get(idLayer);\n        if (!grid) {\n            return;\n        }\n        grid[position.y][position.x] = state;\n    }\n    next() {\n        const task = this.queue[0];\n        if (!task) {\n            return;\n        }\n        const currentNode = task.takeLastNode();\n        if (currentNode) {\n            if (currentNode.position.x === task.to.x &&\n                currentNode.position.y === task.to.y) {\n                this.queue.shift();\n                task.complete(currentNode.compute());\n            }\n            else {\n                this.getNextDirections(task, currentNode).forEach((offset) => {\n                    const position = {\n                        x: currentNode.position.x + offset.x,\n                        y: currentNode.position.y + offset.y,\n                    };\n                    const weights = this.weights.get(task.idLayer) ?? [];\n                    const nextWeight = task.getNextWeight(currentNode, offset, weights);\n                    const nextNode = task.pickNode(position);\n                    if (nextNode) {\n                        if (nextWeight < nextNode.getWeight()) {\n                            task.useNode(currentNode, nextNode, nextWeight);\n                        }\n                    }\n                    else {\n                        task.addNode(currentNode, position, nextWeight);\n                    }\n                });\n            }\n        }\n        else {\n            this.queue.shift();\n            task.complete({\n                path: null,\n                weight: Infinity,\n            });\n        }\n        this.next();\n    }\n    getNextDirections(task, node) {\n        const directions = [];\n        const clears = new Set();\n        Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_STRAIGHT).forEach(([key, direction]) => {\n            if (this.isWalkable(task.idLayer, node, direction)) {\n                clears.add(key);\n                directions.push(direction);\n            }\n        });\n        if (task.diagonals) {\n            Object.entries(PATHFINDING_PROCESS_NEXT_DIRECTIINS_DIAGONAL).forEach(([key, direction]) => {\n                const clear = clears.has(key[0]) && clears.has(key[1]);\n                if (clear && this.isWalkable(task.idLayer, node, direction)) {\n                    directions.push(direction);\n                }\n            });\n        }\n        return directions;\n    }\n    isWalkable(idLayer, node, direction) {\n        const grid = this.grids.get(idLayer);\n        if (!grid) {\n            return false;\n        }\n        const y = node.position.y + direction.y;\n        const x = node.position.x + direction.x;\n        return Boolean(grid[y]?.[x]);\n    }\n}\n\n// EXTERNAL MODULE: ./node_modules/heap/index.js\nvar heap = __webpack_require__(731);\nvar heap_default = /*#__PURE__*/__webpack_require__.n(heap);\n;// CONCATENATED MODULE: ./src/layer/const.ts\nconst PATHFINDING_DEFAULT_TILE_WEIGHT = 1.0;\n\n;// CONCATENATED MODULE: ./src/node/index.ts\n\nclass PathfindingNode {\n    position;\n    distance;\n    parent = null;\n    weight;\n    constructor({ position, distance, weight = PATHFINDING_DEFAULT_TILE_WEIGHT, }) {\n        this.position = { ...position };\n        this.distance = distance;\n        this.weight = weight;\n    }\n    getBetterGuessDistance() {\n        return this.weight + this.distance;\n    }\n    getWeight() {\n        return this.weight;\n    }\n    setWeight(weight) {\n        this.weight = weight;\n    }\n    getParent() {\n        return this.parent;\n    }\n    setParent(parent) {\n        this.parent = parent;\n    }\n    compute() {\n        const path = [{ ...this.position }];\n        const weight = this.parent ? this.parent.getWeight() : 0;\n        let parent = this.getParent();\n        while (parent) {\n            path.push({ ...parent.position });\n            parent = parent.getParent();\n        }\n        path.reverse();\n        return { path, weight };\n    }\n    getNextWeight(shift, weights) {\n        const x = this.position.x + shift.x;\n        const y = this.position.y + shift.y;\n        const weight = weights[y]?.[x] ?? PATHFINDING_DEFAULT_TILE_WEIGHT;\n        if (Math.abs(shift.x) + Math.abs(shift.y) !== 1) {\n            return (weight * Math.SQRT2 +\n                (weights[this.position.y]?.[x] ?? 0.0) +\n                (weights[y]?.[this.position.x] ?? 0.0));\n        }\n        return weight;\n    }\n}\n\n;// CONCATENATED MODULE: ./src/task/index.ts\n\n\nclass PathfindingTask {\n    from;\n    to;\n    id;\n    diagonals;\n    idLayer;\n    tree = [];\n    nodes;\n    complete;\n    constructor({ idTask, from, to, idLayer, diagonals = true }, onComplete) {\n        this.id = idTask;\n        this.from = { ...from };\n        this.to = { ...to };\n        this.idLayer = idLayer;\n        this.diagonals = diagonals;\n        this.complete = onComplete;\n        this.nodes = new (heap_default())((nodeA, nodeB) => nodeA.getBetterGuessDistance() - nodeB.getBetterGuessDistance());\n        const node = new PathfindingNode({\n            position: this.from,\n            distance: this.getDistanceFrom(this.from),\n        });\n        this.pushNode(node);\n    }\n    getDistanceFrom(position) {\n        return Math.sqrt((position.x - this.to.x) ** 2 + (position.y - this.to.y) ** 2);\n    }\n    addNode(parent, position, weight) {\n        const node = new PathfindingNode({\n            position,\n            distance: this.getDistanceFrom(position),\n            weight,\n        });\n        node.setParent(parent);\n        this.pushNode(node);\n    }\n    pushNode(node) {\n        this.nodes.push(node);\n        if (!this.tree[node.position.y]) {\n            this.tree[node.position.y] = [];\n        }\n        this.tree[node.position.y][node.position.x] = node;\n    }\n    pickNode(position) {\n        return this.tree[position.y]?.[position.x];\n    }\n    takeLastNode() {\n        return this.nodes.pop() ?? null;\n    }\n    useNode(current, next, weight) {\n        next.setWeight(weight);\n        next.setParent(current);\n        this.nodes.updateItem(next);\n    }\n    getNextWeight(currentNode, shift, weights) {\n        return currentNode.getWeight() + currentNode.getNextWeight(shift, weights);\n    }\n}\n\n;// CONCATENATED MODULE: ./src/worker.ts\n\n\n\n\n\nif (!external_worker_threads_namespaceObject.parentPort) {\n    throw Error(\'Undefined parent port of pathfinding worker\');\n}\nconst events = new PathfindingEvents(external_worker_threads_namespaceObject.parentPort);\nconst process = new PathfindingProcess(external_worker_threads_namespaceObject.workerData.loopRate);\nevents.on(PathfindingEvent.CreateTask, (payload) => {\n    const task = new PathfindingTask(payload, (result) => {\n        events.send(PathfindingEvent.CompleteTask, {\n            idLayer: payload.idLayer,\n            idTask: payload.idTask,\n            result,\n        });\n    });\n    process.createTask(task);\n});\nevents.on(PathfindingEvent.CancelTask, (payload) => {\n    process.cancelTask(payload.idLayer, payload.idTask);\n});\nevents.on(PathfindingEvent.SetWeight, (payload) => {\n    process.setWeight(payload.idLayer, payload.position, payload.value);\n});\nevents.on(PathfindingEvent.SetWalkable, (payload) => {\n    process.setWalkable(payload.idLayer, payload.position, payload.state);\n});\nevents.on(PathfindingEvent.AddLayer, (payload) => {\n    process.addLayer(payload.idLayer, payload.grid);\n});\nevents.on(PathfindingEvent.RemoveLayer, (payload) => {\n    process.removeLayer(payload.idLayer);\n});\n\n})();\n\nmodule.exports = __webpack_exports__;\n/******/ })()\n;'}},e={};function t(r){var i=e[r];if(void 0!==i)return i.exports;var a=e[r]={exports:{}};return n[r](a,a.exports,t),a.exports}t.n=n=>{var e=n&&n.__esModule?()=>n.default:()=>n;return t.d(e,{a:e}),e},t.d=(n,e)=>{for(var r in e)t.o(e,r)&&!t.o(n,r)&&Object.defineProperty(n,r,{enumerable:!0,get:e[r]})},t.o=(n,e)=>Object.prototype.hasOwnProperty.call(n,e),t.r=n=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})};var r={};(()=>{"use strict";t.r(r),t.d(r,{Pathfinding:()=>E});const n=require("worker_threads");class e{listeners=new Map;parent;constructor(n){this.parent=n,this.parent.on("message",(n=>{this.listeners.get(n.event)?.(n.payload)}))}on(n,e){this.listeners.set(n,e)}send(n,e){this.parent.postMessage({event:n,payload:e})}}var i;!function(n){n.CreateTask="CreateTask",n.CompleteTask="CompleteTask",n.CancelTask="CancelTask",n.AddLayer="AddLayer",n.RemoveLayer="RemoveLayer",n.SetWalkable="SetWalkable",n.SetWeight="SetWeight"}(i||(i={}));const a=require("node:crypto");var s=t.n(a);const o={randomUUID:s().randomUUID},p=new Uint8Array(256);let d=p.length;function h(){return d>p.length-16&&(s().randomFillSync(p),d=0),p.slice(d,d+=16)}const l=[];for(let n=0;n<256;++n)l.push((n+256).toString(16).slice(1));const u=function(n,e,t){if(o.randomUUID&&!e&&!n)return o.randomUUID();const r=(n=n||{}).random||(n.rng||h)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,e){t=t||0;for(let n=0;n<16;++n)e[t+n]=r[n];return e}return function(n,e=0){return(l[n[e+0]]+l[n[e+1]]+l[n[e+2]]+l[n[e+3]]+"-"+l[n[e+4]]+l[n[e+5]]+"-"+l[n[e+6]]+l[n[e+7]]+"-"+l[n[e+8]]+l[n[e+9]]+"-"+l[n[e+10]]+l[n[e+11]]+l[n[e+12]]+l[n[e+13]]+l[n[e+14]]+l[n[e+15]]).toLowerCase()}(r)};class c{uuid;pathfinding;grid;weights=[];lastTaskId=0;handlers=new Map;constructor(n,e){this.pathfinding=n,this.grid=e,this.uuid=u()}remove(){this.pathfinding.removeLayer(this.uuid)}setWalkable(n,e){this.isWalkable(n)!==e&&(this.grid[n.y]||(this.grid[n.y]=[]),this.grid[n.y][n.x]=e,this.pathfinding.events.send(i.SetWalkable,{idLayer:this.uuid,position:n,state:e}))}isWalkable(n){return Boolean(this.grid[n.y]?.[n.x])}setWeight(n,e){this.getWeight(n)!==e&&(this.weights[n.y]||(this.weights[n.y]=[]),this.weights[n.y][n.x]=e,this.pathfinding.events.send(i.SetWeight,{idLayer:this.uuid,position:n,value:e}))}resetWeight(n){void 0!==this.weights[n.y]?.[n.x]&&(delete this.weights[n.y][n.x],this.pathfinding.events.send(i.SetWeight,{idLayer:this.uuid,position:n,value:null}))}getWeight(n){return this.weights[n.y]?.[n.x]??1}findPath(n,e){const t=++this.lastTaskId;return this.pathfinding.events.send(i.CreateTask,{...n,idLayer:this.uuid,idTask:t}),this.handlers.set(t,e),t}cancel(n){if(!this.handlers.has(n))throw Error(`Pathfinding task with id '${n}' is not found`);this.pathfinding.events.send(i.CancelTask,{idLayer:this.uuid,idTask:n}),this.handlers.delete(n)}}const _=require("fs");var f=t.n(_);const y=require("path");var m=t.n(y),g=t(232),k=t.n(g);class w{workerPath;constructor(n){this.workerPath=m().resolve(__dirname,n)}workerExists(){return f().existsSync(this.workerPath)}createWorker(){f().writeFileSync(this.workerPath,k())}}class E{worker;events;layers=new Map;constructor({runtime:t=!0,workerPath:r="./pathfinding.worker.js",loopRate:a,resourceLimits:s}={}){const o=new w(r);t&&!o.workerExists()&&o.createWorker(),this.worker=new n.Worker(o.workerPath,{name:"pathfinding",workerData:{loopRate:a},resourceLimits:s}),this.events=new e(this.worker),this.events.on(i.CompleteTask,(({idLayer:n,idTask:e,result:t})=>{const r=this.layers.get(n);if(!r)return;const i=r.handlers.get(e);i&&(i(t),r.handlers.delete(e))}))}destroy(){return this.worker.terminate()}createLayer(n){const e=new c(this,n);return this.layers.set(e.uuid,e),this.events.send(i.AddLayer,{idLayer:e.uuid,grid:n}),e}removeLayer(n){this.layers.has(n)&&(this.layers.delete(n),this.events.send(i.RemoveLayer,{idLayer:n}))}}})(),module.exports=r})();