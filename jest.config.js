module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: './coverage/js',
  setupFiles: ['<rootDir>/.env.test'],
  globalSetup: "<rootDir>/dotenv-test.js",
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!coverage/**',
    '!bin/**',
    '!babel.config.js',
    '!jest.config.js',
  ],
};