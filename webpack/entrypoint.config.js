const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    index: path.resolve(root, 'src/index.ts'),
  },
  output: {
    path: path.resolve(root, 'dist'),
    chunkFilename: '[name].js',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
};
