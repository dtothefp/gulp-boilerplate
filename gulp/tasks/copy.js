export default function(gulp, plugins, config) {
  return () => {
    gulp.src('./src/**/*.html')
      .pipe(gulp.dest('./dist'));
  };
}

