const path = require('path');

const InjectWorkerPlugin = require('./worker.plugin');

const root = path.resolve(__dirname, '..');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: path.resolve(root, 'src/worker.ts'),
  output: {
    path: path.resolve(root, '.temp'),
    filename: 'worker.inline.js',
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
