import {resolve, join} from 'path';

export default function(gulp, plugins, config) {
  var {testPaths, file} = config;
  var {mocha} = plugins;
  let babelPath = resolve(__dirname, '..', 'config/babelhook');
  var src = file ? join(process.cwd(), 'test/**/', `${file}.js`) : testPaths;

  return () => {
    return gulp.src(src)
      .pipe(mocha({
        timeout: 40000,
        require: [ babelPath ]
      }))
      .once('error', function () {
        console.log('MOCHA ERROR');
        process.exit(1);
      })
      .once('end', function () {
        console.log('MOCHA DONE');
        process.exit();
      });
  };
}
