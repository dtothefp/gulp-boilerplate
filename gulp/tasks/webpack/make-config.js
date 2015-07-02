import {join, resolve} from 'path';
import webpack from 'webpack';
import eslintConfig from '../eslint/eslint-config';
import formatter from 'eslint-friendly-formatter';

export default function(opts) {
  var {ENV, jsSrc, isTest} = opts;
  let rules = eslintConfig({
    ENV
  });
  const isDev = ENV === 'DEV';
  var plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch',
      'window.fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch',
      'global.fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch'
    })
  ];

  var devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  var prodPlugins = [
    //new webpack.optimize.UglifyJsPlugin({
      //output: {
        //comments: false
      //},
      //compress: {
        //warnings: false
      //},
      //sourceMap: false
    //}),
    //new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ];

  var devEntry = [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/dev-server'
  ];

  var src = [
    join(jsSrc, 'index.js')
  ];

  var testEntry = [
    join(jsSrc, 'phantom-shim.js')
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
    //{
      //test: /node_modules\/node-fetch\/index\.js/,
      //loader: 'exports?window.fetch || Fetch;'
    //},
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
    resolve: {
      alias: {
        fetch: 'isomorphic-fetch'
      }
    },
    plugins: plugins,
    devtool: ENV === 'DEV' ? 'eval' : null
  };

  var concatArr = (configArr, add) => {
    return configArr.push.apply(configArr, add);
  };

  if(isDev && !isTest) {
    concatArr(config.entry, devEntry);
    concatArr(config.entry, testEntry);
    config.devtool = 'eval';
    concatArr(config.plugins, devPlugins);
  } else if (isTest) {
    concatArr(config.entry, testEntry);
    concatArr(config.plugins, prodPlugins);
  } else {
    concatArr(config.plugins, prodPlugins);
  }

  return config;
}
