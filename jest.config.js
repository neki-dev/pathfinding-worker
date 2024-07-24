module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleNameMapper: {
    '^worker-loader!': 'identity-obj-proxy',
  },
};
