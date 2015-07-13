'use strict';

import gulp from 'gulp';
import tasks, {config, plugins as $} from './gulp/config/gulpfile-utils';
var {ENV} = config;
var isDev = ENV === 'DEV';

gulp.task('webpack', tasks.webpack);
gulp.task('lint', tasks.eslint);
gulp.task('browser-sync', ['build'], tasks.browserSync);
gulp.task('template', tasks.template);
gulp.task('karma', tasks.karma);
gulp.task('karma:ci', tasks.karma);
gulp.task('mocha', tasks.mocha);

gulp.task('build', ['lint', 'webpack', 'template']);

gulp.task('default', isDev ? ['browser-sync'] : ['build']);

gulp.task('test', (cb) => {
  $.sequence(
    'build',
    'mocha',
    cb
  );
});
