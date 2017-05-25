let gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    babel = require('gulp-babel'),
    pump = require('pump'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin');

let concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify');

let src   = 'src',
    build = 'build';

let host = 'localhost';

gulp.task('webserver', function() {
    gulp.src(build)
        .pipe(webserver({
            livereload: true,
            host: host,
            open: true
        }));
});

gulp.task('styles', function() {
   return gulp
       .src(src + '/scss/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(sourcemaps.write('maps'))
       .pipe(gulp.dest(build+'/css'));
});

gulp.task('prod-js', function (cb) {
    pump(
        [
            gulp.src(src + '/js/*.js'),
            stripDebug(),
            babel({
                presets: ['es2015']
            }),
            uglify(),
            gulp.dest(build+'/js')
        ],
        cb
    );
});

gulp.task('prod-html', function() {
  return gulp.src(src + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(build));
});

gulp.task('dev-js', function (cb) {
    pump(
        [
            gulp.src(src + '/js/*.js'),
            babel({
                presets: ['es2015']
            }),
            gulp.dest(build+'/js')
        ],
        cb
    );
});

gulp.task('dev-html', function() {
  return gulp.src(src + '/*.html')
    .pipe(gulp.dest(build));
});

gulp.task('dev', ['dev-js', 'styles', 'dev-html', 'webserver', 'watch']);
gulp.task('production', ['prod-js', 'styles', 'prod-html']);

gulp.task('watch', function() {
    gulp.watch(src+'/js/*.js', ['dev-js']);
    gulp.watch(src+'/scss/*.scss', ['styles']);
    gulp.watch(src+'/*.html', ['dev-html']);
});