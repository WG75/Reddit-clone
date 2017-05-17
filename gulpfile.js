var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imgmin = require('gulp-imagemin');
plumber = require('gulp-plumber');



gulp.task('sass', function(){
  gulp.src('app/assets/css/*.sass')
  .pipe(plumber())
  .pipe(sass({
    errLogToConsole: true
  }))
  .pipe(gulp.dest('app/assets/css'))
  .pipe(browserSync.stream())
})


gulp.task('browsersync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})


gulp.task('serve', ['sass', 'browsersync'],  function(){

  gulp.watch('app/**/*.+(html|js)', browserSync.reload);
  gulp.watch('app/**/*.sass', ['sass']);
})


gulp.task('minify', function(){
  gulp.src('app/**/*.html')
  .pipe(useref())
  .pipe(gulpif('*.js', uglify()))
  .pipe(gulpif('*.css', cssnano()))
  .pipe(gulp.dest('dist/assets'))
})


gulp.task('imgmin', function(){
  gulp.src('app/assets/img/*.+(png|jpg|gif)')
  .pipe(imgmin())
  .pipe(gulp.dest('dist/assets/img'))
})



gulp.task('build', ['minify', 'imgmin']);
