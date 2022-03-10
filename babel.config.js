module.exports = {
  presets: ['module:metro-react-native-babel-preset'],

  // if no 'babel-plugin-macros' here, will cause
  // Error: Unable to resolve module `path` from `node_modules/babel-plugin-macros/dist/index.js`: path could not be found within the project.
  plugins: ['babel-plugin-macros'],
};
