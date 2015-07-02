import webpack from 'webpack';
import {join} from 'path';
const testPath = join(__dirname, 'test-config.js');
var preprocessors = {};
preprocessors[testPath] = [ 'webpack', 'sourcemap' ];

export default function (config) {
  config.set({
    browsers: [ 'Chrome' ],
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      testPath
    ],
    preprocessors,
    reporters: [ 'dots' ],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
}
