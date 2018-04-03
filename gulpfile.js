var gulp = require('gulp')
var pug = require('gulp-pug')
var stylus = require('gulp-stylus')
var livereload = require('gulp-livereload')
livereload({ start: true })

gulp.task('html', function () {
  return gulp.src('public/explorer/src/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/explorer/build'))
})

gulp.task('css', function () {
  return gulp.src('public/explorer/src/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/explorer/build'))
})

gulp.task('watch', function () {
  livereload.listen()
  gulp.watch('public/explorer/src/**/*.styl', ['css'])
  gulp.watch('public/explorer/src/**/*.pug', ['html'])
})

gulp.task('default', ['html', 'css'])
