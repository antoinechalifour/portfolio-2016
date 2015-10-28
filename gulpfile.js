const gulp = require('gulp');
const less = require('gulp-less');
const prefix = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

const browserify = require('browserify');
const debowerify = require('debowerify');
const shim = require('browserify-shim');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('vendors', _ => {
  return gulp.src('src/bower_components/**/*.*')
    .pipe(gulp.dest('dist/bower_components/'));
});

gulp.task('less', _ => {
  return gulp.src('src/styles/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(prefix("last 8 version", "> 1%", "ie 8", "ie 7"), {cascade:true})
    .pipe(gulp.dest('dist/'));
});

gulp.task('html', _ => {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('assets', _ => {
  return gulp.src('src/img/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img//'));
});

gulp.task('js', _ => {
  return browserify({
    entries: 'src/scripts/app.js',
    debug: true
  })
  .transform(babelify)
  //.transform(debowerify)
  .transform(shim)
  .bundle()
  .pipe(source('all.js'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('watch', _ => {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.less', ['less']);
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('dev', ['html', 'assets', 'vendors', 'less', 'js', 'watch']);