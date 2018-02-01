/* global require */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('compress', () => {
  return gulp.src('lib/bundle/*.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib/bundle'));
});
