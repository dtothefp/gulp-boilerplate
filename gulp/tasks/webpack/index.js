import {join} from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import makeConfig from './make-config';

export default function(gulp, plugins, config) {
  var {ENV, jsSrc, isTest} = config;
  var {gutil} = plugins;
    console.log('IS TEST', isTest);
  const isDev = ENV === 'DEV';
  var webpackConfig = makeConfig({
    ENV,
    isTest,
    jsSrc
  });
  let PluginError = gutil.PluginError;

  return (cb) => {
    const compiler = webpack(webpackConfig);
    var bundleStart = null;

    const logger = (err, stats) => {
      if(err) throw new PluginError('webpack-dev-server', err);

      if(isDev && !isTest) {
        gutil.log('[webpack-dev-server]', 'http://localhost:3001/webpack-dev-server/');
      } else {
        gutil.log(stats.toString());
      }
      cb();
    };

    if(isDev && !isTest) {
      compiler.plugin('compile', function() {
        console.log('Webpack Bundling...');
        bundleStart = Date.now();
      });

      compiler.plugin('done', function() {
        console.log(`Webpack Bundled in ${(Date.now() - bundleStart)}ms`);
      });

      new WebpackDevServer(compiler, {
        contentBase: join(process.cwd(), 'dist'),
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        quiet: false,
        noInfo: true,
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
        },
        headers: { 'X-Custom-Header': 'yes' },
        stats: { colors: true }
      }).listen(3001, 'localhost', logger);
    } else {
      compiler.run(logger);
    }
  };
}
