/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

class InjectWorkerPlugin {
  apply(compiler) {
    const ConcatSource = compiler.webpack.sources.ConcatSource;
    const tester = { test: this.test };

    compiler.hooks.compilation.tap('InjectWorkerPlugin', (compilation) => {
      compilation.hooks.afterOptimizeChunkAssets.tap('InjectWorkerPlugin', (chunks) => {
        for (const chunk of chunks) {
          for (const fileName of chunk.files) {
            if (ModuleFilenameHelpers.matchObject(tester, fileName)) {
              wrapFile(compilation, fileName);
            }
          }
        }
      });
    });

    function wrapFile(compilation, fileName) {
      compilation.assets[fileName] = new ConcatSource(
        'module.exports = `',
        compilation.assets[fileName],
        '`;',
      );
    }
  }
}

module.exports = InjectWorkerPlugin;
