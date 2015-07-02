import {resolve} from 'path';
import {server as karma} from 'karma';

export default function(gulp, plugins, config) {
  return (cb) => {
    karma.start({
      port: 9876,
      configFile: resolve(__dirname, '.', 'karma-config.js'),
      singleRun: true
    }, cb);
  };
}

