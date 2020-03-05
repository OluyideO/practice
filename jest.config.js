module.exports = {
  roots: [
    "./src"
  ],
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFiles: [
      "jest-date-mock"
  ],
  testResultsProcessor: "jest-sonar-reporter"
};