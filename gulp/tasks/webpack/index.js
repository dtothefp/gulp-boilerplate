import {join} from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import makeConfig from './make-config';

export default function(gulp, plugins, config) {
  var {ENV, jsSrc} = config;
  const isDev = ENV === 'DEV';
  var webpackConfig = makeConfig({
    ENV,
    jsSrc
  });
  let gutil = plugins.util;
  let PluginError = gutil.PluginError;

  return () => {
    const compiler = webpack(webpackConfig);
    const logger = (err, stats) => {
      if(err) throw new PluginError('webpack-dev-server', err);

      if(isDev) {
        gutil.log('[webpack-dev-server]', 'http://localhost:3000/webpack-dev-server/');
      } else {
        gutil.log(stats.toString());
      }
    };

    if(isDev) {
      new WebpackDevServer(compiler, {
        contentBase: join(process.cwd(), 'dist'),
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        quiet: false,
        noInfo: false,
        watchDelay: 300,
        headers: { 'X-Custom-Header': 'yes' },
        stats: { colors: true }
      }).listen(3000, 'localhost', logger);
    } else {
      compiler.run(logger);
    }
  };
}
