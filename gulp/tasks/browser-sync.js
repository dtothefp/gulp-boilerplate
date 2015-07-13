import browserSync from 'browser-sync';

export default function(gulp, plugins, config) {
  let bs = browserSync.create();
  return (cb) => {
    browserSync.init({
      server: {
        baseDir: './dist'
      }
    }, cb);
  };
}
