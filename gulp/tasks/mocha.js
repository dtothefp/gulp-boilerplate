import {resolve, join} from 'path';

export default function(gulp, plugins, config) {
  var {file} = config;
  var {mocha} = plugins;
  let babelPath = resolve(__dirname, '..', 'config/babelhook');
  var src = join(process.cwd(), 'test/unit/**', file ? `${file}.js` : '*-spec.js');

  return () => {
    return gulp.src([
        src,
        '!' + join(process.cwd(), 'test/integration/**/*.js')
      ])
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
