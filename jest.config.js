/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Essential for testing DOM manipulations
  roots: ['<rootDir>/src'], // Jest should look for test files in the 'src' directory
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)', // Match test files in __tests__ folders
    '**/?(*.)+(spec|test).+(ts|tsx|js)' // Match .spec.ts or .test.ts files
  ],
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
};