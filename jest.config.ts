const config = {
  coverageDirectory: "reports/coverage",
  coverageReporters: ["lcov", "html"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
    "~test/*": ["./test/*"],
  },
  preset: "ts-jest",
  prettierPath: require.resolve("prettier-2"),
  transform: {
    "\\.js$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  roots: ["<rootDir>/test", "<rootDir>/src"],
};

export default config;
