const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/*.test.ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleDirectories: ["node_modules", "src"],
};

export default config;
