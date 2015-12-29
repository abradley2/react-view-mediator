var gulp = require('gulp'),
    jsdoc = require('gulp-jsdoc3');

module.exports = function(cb){
  gulp.src(['DOCUMENTATION.md', './src/**/*.js'], {read: false})
    .pipe(jsdoc({
      opts: {
        destination: './documentation'
      }
    }, cb));
};
