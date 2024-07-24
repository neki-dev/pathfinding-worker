module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: [
    '<rootDir>/src/__mocks__/worker-module.ts',
  ],
  moduleNameMapper: {
    '.*\\.inline\\.js': '<rootDir>/src/__mocks__/inline.ts',
  },
};
