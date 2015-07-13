import {join, resolve} from 'path';
import {merge} from 'lodash';
import webpack from 'webpack';
import WebpackNotifierPlugin from 'webpack-notifier';
import eslintConfig from '../eslint/eslint-config';
import formatter from 'eslint-friendly-formatter';

export default function(opts) {
  var {ENV, jsSrc} = opts;

  let rules = eslintConfig({
    ENV
  });

  var addRewire = (loaders) => {
    return loaders.map((o) => {
      if(/babel/.test(o.loader)) {
        o.loader += '&plugins=babel-plugin-rewire';
      }
      return o;
    });
  };

  var plugins = [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch',
      'window.fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch',
      'global.fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    })
  ];

  var devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  var prodPlugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
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
      loader: 'babel?optional[]=runtime&stage=0'
    },
    {
      test: /\.json$/,
      loader: 'json'
    }
  ];

  var config = {
    externals: {
      jquery: 'window.jQuery'
    },
    module: {
      loaders: loaders
    },
    resolve: {
      extensions: ['', '.js'],
      alias: {
        fetch: 'isomorphic-fetch'
      }
    }
  };

  const configFn = {
    DEV(isProd) {
      let hotComponents = [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/dev-server'
      ];
      let devConfig = {
        entry:  [
          join(jsSrc, 'index.js')
        ],
        output: {
          path: join(process.cwd(), 'dist'),
          publicPath: '/',
          filename: '[name].js'
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
        plugins: plugins.concat(devPlugins)
      };

      if(!isProd) {
        devConfig.devtool = 'eval';
        devConfig.entry.push.apply(devConfig, hotComponents);
      }

      return merge({}, config, devConfig);
    },

    PROD() {
      let prodConfig = merge({}, this.DEV(true), {
        plugins: plugins.concat(prodPlugins)
      });

      // allow getting rid of the UglifyJsPlugin
      // https://github.com/webpack/webpack/issues/1079
      prodConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false
          },
          compress: {
            warnings: false
          },
          sourceMap: false
        })
      );

      return prodConfig;
    },

    TEST() {
      let testConfig = {
        module: {
          loaders: addRewire(loaders)
        },
        plugins: plugins.concat(devPlugins),
        watch: true,
        devtool: 'inline-source-map'
      };

      return merge({}, config, testConfig);
    },

    CI() {
      let ciConfig = {
        module: {
          loaders: addRewire(loaders),
          postLoaders: [
            {test: /\.js$/, loader: 'uglify', exclude: /\.test\.js$/}
          ]
        },
        plugins: plugins.concat(prodPlugins),
        'uglify-loader': {
          compress: {warnings: false}
        }
      };

      return merge({}, config, ciConfig);
    }
  };

  var compileConfig = configFn[ENV]();

  return compileConfig;
}
