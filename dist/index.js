/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/const.ts":
/*!**********************!*\
  !*** ./src/const.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PATHFINDING_WORKER_DIST_FILE_NAME = void 0;\nexports.PATHFINDING_WORKER_DIST_FILE_NAME = \"./dist/index.worker.js\";\n\n\n//# sourceURL=webpack://pathfinding-worker/./src/const.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Pathfinding = void 0;\n// @ts-ignore\nconst worker_1 = __importDefault(__webpack_require__(/*! worker-loader!./worker */ \"./node_modules/worker-loader/dist/cjs.js!./src/worker/index.ts\"));\nconst worker_threads_1 = __webpack_require__(/*! worker_threads */ \"worker_threads\");\nconst const_1 = __webpack_require__(/*! ./const */ \"./src/const.ts\");\nconst types_1 = __webpack_require__(/*! ./worker/types */ \"./src/worker/types.ts\");\nclass Pathfinding {\n    worker;\n    pointsCost = [];\n    lastTaskId = 0;\n    resultCallbacks = new Map();\n    constructor(grids) {\n        // Trigger webpack worker build\n        void worker_1.default;\n        this.worker = new worker_threads_1.Worker(const_1.PATHFINDING_WORKER_DIST_FILE_NAME, {\n            workerData: { grids },\n        });\n        this.listen(types_1.PathfindingWorkerEvent.CompleteTask, (payload) => {\n            const callback = this.getTaskCallback(payload.idTask);\n            if (callback) {\n                callback(payload.result);\n            }\n            else {\n                // Events occurs for canceled tasks, since the path calculation occurs sequentially in single process.\n                // Need to figure out how to interrupt the calculation for a canceled task.\n            }\n        });\n    }\n    destroy() {\n        this.worker.terminate();\n    }\n    setWalkable(group, position, state) {\n        this.send(types_1.PathfindingWorkerEvent.SetWalkable, {\n            position,\n            group,\n            state,\n        });\n    }\n    setPointCost(position, cost) {\n        if (this.getPointCost(position) === cost) {\n            return;\n        }\n        if (!this.pointsCost[position.y]) {\n            this.pointsCost[position.y] = [];\n        }\n        this.pointsCost[position.y][position.x] = cost;\n        this.send(types_1.PathfindingWorkerEvent.UpdatePointCost, {\n            position,\n            cost,\n        });\n    }\n    resetPointCost(position) {\n        if (this.pointsCost[position.y]?.[position.x] === undefined) {\n            return;\n        }\n        delete this.pointsCost[position.y][position.x];\n        this.send(types_1.PathfindingWorkerEvent.UpdatePointCost, {\n            position,\n            cost: null,\n        });\n    }\n    getPointCost(position) {\n        return this.pointsCost[position.y]?.[position.x] ?? 1.0;\n    }\n    createTask(config, callback) {\n        const idTask = ++this.lastTaskId;\n        this.send(types_1.PathfindingWorkerEvent.CreateTask, {\n            ...config,\n            idTask,\n        });\n        this.resultCallbacks.set(idTask, callback);\n        return idTask;\n    }\n    getTaskCallback(idTask) {\n        return this.resultCallbacks.get(idTask) ?? null;\n    }\n    cancelTask(idTask) {\n        this.send(types_1.PathfindingWorkerEvent.CancelTask, {\n            idTask,\n        });\n        this.resultCallbacks.delete(idTask);\n    }\n    listen(event, callback) {\n        this.worker.on(\"message\", (data) => {\n            if (data.event === event) {\n                callback(data.payload);\n            }\n        });\n    }\n    send(event, payload) {\n        this.worker.postMessage({ event, payload });\n    }\n}\nexports.Pathfinding = Pathfinding;\n\n\n//# sourceURL=webpack://pathfinding-worker/./src/index.ts?");

/***/ }),

/***/ "./src/worker/types.ts":
/*!*****************************!*\
  !*** ./src/worker/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.PathfindingWorkerEvent = void 0;\nvar PathfindingWorkerEvent;\n(function (PathfindingWorkerEvent) {\n    PathfindingWorkerEvent[\"CreateTask\"] = \"CreateTask\";\n    PathfindingWorkerEvent[\"CompleteTask\"] = \"CompleteTask\";\n    PathfindingWorkerEvent[\"CancelTask\"] = \"CancelTask\";\n    PathfindingWorkerEvent[\"UpdatePointCost\"] = \"UpdatePointCost\";\n    PathfindingWorkerEvent[\"SetWalkable\"] = \"SetWalkable\";\n})(PathfindingWorkerEvent || (exports.PathfindingWorkerEvent = PathfindingWorkerEvent = {}));\n\n\n//# sourceURL=webpack://pathfinding-worker/./src/worker/types.ts?");

/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js!./src/worker/index.ts":
/*!**********************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js!./src/worker/index.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Worker_fn)\n/* harmony export */ });\nfunction Worker_fn() {\n  return new Worker(__webpack_require__.p + \"index.worker.js\");\n}\n\n\n//# sourceURL=webpack://pathfinding-worker/./src/worker/index.ts?./node_modules/worker-loader/dist/cjs.js");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;