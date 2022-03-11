module.exports = {
  root: true,
  extends: '@react-native-community',
  globals: {
    Blob: false,
    ENV: false,
    ImageData: false,
    Worker: false,
    XMLSerializer: false,
    atob: false,
    btoa: false,
  },
  rules: {
    'no-bitwise': 0,
  },
};
