module.exports = {
  name: "App name",
  script: "yarn build:push",
  watch: ["gulpfile.js", "package.json", "tslint.json", "tsconfig.json", "src"],
  ignore_watch: ["node_modules"],
};
