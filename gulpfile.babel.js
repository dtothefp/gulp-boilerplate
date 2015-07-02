'use strict';

import gulp from 'gulp';
import tasks, {ENV, plugins as $} from './gulp/config/gulpfile-utils';
var isDev = ENV === 'DEV';

gulp.task('webpack', tasks.webpack);
gulp.task('lint', tasks.eslint);
gulp.task('connect', tasks.connect);
gulp.task('template', tasks.template);
gulp.task('karma', tasks.karma);
gulp.task('mocha', tasks.mocha);
gulp.task('open', tasks.open);

gulp.task('build', ['lint', 'webpack', 'template']);

gulp.task('default', (cb) => {
  $.sequence(
    'build',
    'connect',
    'open',
    cb
  );
});

gulp.task('test', (cb) => {
  $.sequence(
    'build',
    'connect',
    'mocha',
    cb
  );
});
