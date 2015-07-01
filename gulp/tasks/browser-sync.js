export default function(gulp, plugins, config) {
  var {browserSync} = plugins;

  return () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
  };
}

