const extraNodeModules = require('node-libs-react-native');

module.exports = {
  extraNodeModules,
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};