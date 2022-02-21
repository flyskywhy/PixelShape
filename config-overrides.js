// used by react-app-rewired

const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: function (config, env) {
    // To enable the eslint rules in '.eslintrc.js'
    config.module.rules[1].use[0].options.baseConfig.extends = [
      path.resolve('.eslintrc.js'),
    ];

    // To avoid sometimes react-app-rewired is not honouring your change to the eslint rules
    // in '.eslintrc.js', you should manually disable the eslint cache, ref to
    // https://github.com/facebook/create-react-app/issues/9007#issuecomment-628601097
    config.module.rules[1].use[0].options.cache = false;

    // To enable '.eslintignore'
    config.module.rules[1].use[0].options.ignore = true;

    // To let alias like 'react-native/Libraries/Components/StaticRenderer'
    // take effect, must set it before alias 'react-native'
    delete config.resolve.alias['react-native'];
    config.resolve.alias['react-native/Libraries/Components/StaticRenderer'] =
      'react-native-web/dist/vendor/react-native/StaticRenderer';
    config.resolve.alias['react-native'] = path.resolve(
      'web/aliases/react-native',
    );

    // Let's force our code to bundle using the same bundler react native does.
    // config.plugins[3].definitions.__DEV__ = env === 'development';
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: env === 'development',
      }),
    );

    // Keep all rules except the eslint - note that if they add additional rules this will need updating to match
    // Consider if this should only apply to the development environment? If so, uncomment the if statement
    // if (env === 'development') {
    //  config.module.rules.splice(1, 1);
    // }

    // Need this rule to prevent `Attempted import error: 'SOME' is not exported from` when `react-app-rewired build`
    // Need this rule to prevent `TypeError: Cannot assign to read only property 'exports' of object` when `react-app-rewired start`
    config.module.rules.push({
      test: /\.(js|tsx?)$/,
      // You can exclude the exclude property if you don't want to keep adding individual node_modules
      // just keep an eye on how it effects your build times, for this example it's negligible
      // exclude: /node_modules[/\\](?!@react-navigation|react-native-gesture-handler|react-native-screens)/,
      use: {
        loader: 'babel-loader',
      },
    });

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        inline: 'no-fallback',
      },
    });

    return config;
  },
  paths: function (paths, env) {
    paths.appIndexJs = path.resolve('index.web.js');
    paths.appSrc = path.resolve('.');
    paths.moduleFileExtensions.push('ios.js');
    paths.moduleFileExtensions.push('android.js');
    paths.moduleFileExtensions.push('native.js');
    return paths;
  },
};
