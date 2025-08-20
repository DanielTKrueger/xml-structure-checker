/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test/unit"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }]
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["server/**/*.ts", "src/**/*.ts"],
  coverageDirectory: "coverage"
};
