const path = require('path');

const { WEBPACK_INLINE_WORKER_TEMP_FILE_NAME } = require('./const');
const InjectWorkerPlugin = require('./worker.plugin');

const root = path.resolve(__dirname, '..');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: path.resolve(root, 'src/worker/index.ts'),
  output: {
    path: path.resolve(root, '.temp'),
    filename: WEBPACK_INLINE_WORKER_TEMP_FILE_NAME,
    libraryTarget: 'commonjs2',
    clean: true,
  },
  plugins: [
    new InjectWorkerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
};
