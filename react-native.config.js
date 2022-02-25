module.exports = {
  // config as a sub-app (library) to be embeded is scoped under "dependency" key
  dependency: {
    platforms: {
      ios: null,
      android: null, // projects are grouped into "platforms"
      macos: null,
      windows: null,
    },
    assets: [],
    // hooks are considered anti-pattern, please avoid them
    hooks: {
      // prelink: 'node ./node_modules/PixelShapeRN/scripts/prelink.js',
      // postlink: 'node node_modules/PixelShapeRN/scripts/postlink.js',
      // postunlink: 'node node_modules/PixelShapeRN/scripts/postunlink.js',
    },
  },
  // config as an APP is scoped under "dependencies" key
  dependencies: {
    '@flyskywhy/react-native-gcanvas': {
      platforms: {
        android: {
          packageImportPath: 'import com.taobao.gcanvas.bridges.rn.GReactPackage;',
        },
      },
    },
  },
};
