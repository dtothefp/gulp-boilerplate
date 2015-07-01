'use strict';

import gulp from 'gulp';
import tasksMap, {ENV} from './gulp/config/gulpfile-utils';
var isDev = ENV === 'DEV';

gulp.task('webpack', tasksMap.webpack);
gulp.task('lint', tasksMap.eslint);
gulp.task('copy', tasksMap.copy);
gulp.task('nightmare', tasksMap.nightmare);
gulp.task('mocha', tasksMap.mocha);
gulp.task('browser-sync', ['lint', 'webpack', 'copy'], tasksMap.browserSync);

if(isDev) {
  gulp.task('default', ['browser-sync']);
} else {
  gulp.task('default', ['webpack']);
}
