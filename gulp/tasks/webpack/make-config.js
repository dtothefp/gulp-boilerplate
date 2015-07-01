import {join, resolve} from 'path';
import webpack from 'webpack';
import eslintConfig from '../eslint/eslint-config';
import formatter from 'eslint-friendly-formatter';

export default function(opts) {
  var {ENV, jsSrc} = opts;
  let rules = eslintConfig({
    ENV
  });
  const isDev = ENV === 'DEV';
  var plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ];

  var devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ];

  var devEntry = [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    join(jsSrc, 'phantom-shim.js')
  ];

  var src = [
    join(jsSrc, 'index.js')
  ];

  var preLoaders = [
    {
      test: /\.js$/,
      loader: `eslint-loader`,
      exclude: /node_modules/
    }
  ];

  var loaders = [
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    },
    {
      test: /\.json$/,
      loader: 'json'
    }
  ];

  var config = {
    entry:  src,
    output: {
      path: join(process.cwd(), 'dist'),
      publicPath: '/',
      filename: '[name].js'
    },
    externals: {
      jquery: 'window.jQuery'
    },
    eslint: {
      rules,
      configFile: resolve(__dirname, '..', 'eslint/es6-config.json'),
      formatter,
      emitError: true,
      emitWarning: true,
      failOnWarning: true,
      failOnError: true
    },
    module: {
      preLoaders: preLoaders,
      loaders: loaders
    },
    plugins: plugins,
    devtool: ENV === 'DEV' ? 'inline-source-map' : null
  };

  var concatArr = (configArr, add) => {
    return configArr.push.apply(configArr, add);
  };

  if(isDev) {
    concatArr(config.entry, devEntry);
    config.devtool = 'inline-source-map';
    concatArr(config.plugins, devPlugins);
  } else {
    concatArr(config.plugins, prodPlugins);
  }

  return config;
}
