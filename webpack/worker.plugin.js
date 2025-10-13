/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { WEBPACK_INLINE_WORKER_TEMP_FILE_NAME } = require('./const');

class InjectWorkerPlugin {
  apply(compiler) {
    const ConcatSource = compiler.webpack.sources.ConcatSource;

    compiler.hooks.compilation.tap(
      'InjectWorkerPlugin',
      ({ hooks, assets }) => {
        hooks.afterOptimizeChunkAssets.tap('InjectWorkerPlugin', () => {
          const source = assets[WEBPACK_INLINE_WORKER_TEMP_FILE_NAME].source();
          const escapedSource = source
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');
          assets[WEBPACK_INLINE_WORKER_TEMP_FILE_NAME] = new ConcatSource(
            'module.exports = `',
            escapedSource,
            '`;',
          );
        });
      },
    );
  }
}

module.exports = InjectWorkerPlugin;
