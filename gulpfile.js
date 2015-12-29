var gulp = require('gulp'),
    tasks = require('./build');

gulp.task('babel', tasks.babel);

gulp.task('jsdoc', tasks.jsdoc);

gulp.task('build', ['babel']);

gulp.task('default', ['build']);
