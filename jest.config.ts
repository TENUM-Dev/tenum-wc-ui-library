import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "babel-jest",
      { presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"] }
    ]
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"]
};

export default config;
