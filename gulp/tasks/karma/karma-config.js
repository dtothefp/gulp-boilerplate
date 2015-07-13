import {merge} from 'lodash';
import webpack from 'webpack';
import makeWebpackConfig from '../webpack/make-config';
import {join} from 'path';
const testPath = join(process.cwd(), 'test/config/karma-index.js');
const ENV = process.env.NODE_ENV;
var preprocessors = {};
preprocessors[testPath] = ENV === 'CI' ? [ 'webpack'] : [ 'webpack', 'sourcemap' ];

export default function (config) {
  var envConfigs = {
    TEST: {
      autoWatch: true,
      singleRun: false,
      reporters: [ 'spec' ],
      browsers: [ 'Chrome' ]
    },
    CI: {
      autoWatch: false,
      singleRun: true,
      reporters: [ 'dots' ],

      // global config of your BrowserStack account
      browserStack: {
        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_API
      },

      // define browsers
      customLaunchers: {
        bs_firefox_mac: {
          base: 'BrowserStack',
          browser: 'firefox',
          browser_version: '21.0',
          os: 'OS X',
          os_version: 'Mountain Lion'
        },
        bs_ie_windows: {
          base: 'BrowserStack',
          'browser' : 'ie',
          'browser_version' : '11.0',
          'os' : 'Windows',
          'os_version' : '8.1'
        },
        bs_op_windows: {
          base: 'BrowserStack',
          'browser' : 'opera',
          'browser_version' : '12.15',
          'os' : 'Windows',
          'os_version' : 'XP'
        },
        bs_iphone5: {
          base: 'BrowserStack',
          'browserName' : 'iPhone',
          'device' : 'iPhone 5',
          os: 'ios',
          os_version: '6.0'
        }

      },

      browsers: ['bs_firefox_mac', /*'bs_iphone5',*/ 'bs_ie_windows', 'bs_op_windows']
    }
  };

  config.set(merge({}, envConfigs[ENV], {
    frameworks: [ 'mocha' ],
    files: [
      testPath
    ],
    preprocessors,
    client: {
      mocha: {
        ui: 'bdd',
        timeout: 10000
      }
    },
    webpack: makeWebpackConfig({ENV}),
    webpackServer: {
      noInfo: true
    }
  }));
}
