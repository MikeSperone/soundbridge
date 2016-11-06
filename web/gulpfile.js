let gulp = require('gulp');

let build = 'build';
    src = 'src',
    sassOpt = '',
    autopreOpt = '';

let sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');

let babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    pump = require('pump');

let htmlmin = require('gulp-htmlmin');

gulp.task('sass', function() {
       return gulp
           .src(src+'/scss/*.scss')
           .pipe(sourcemaps.init())
           .pipe(sass(sassOpt).on('error', sass.logError))
           .pipe(autoprefixer(autopreOpt))
           .pipe(sourcemaps.write('maps'))
           .pipe(gulp.dest(build + '/css'));
});

gulp.task('sass-prod', function() {
   return gulp
       .src(src+'/scss/*.scss')
       .pipe(sass(sassOpt).on('error', sass.logError))
       .pipe(autoprefixer(autopreOpt))
       .pipe(gulp.dest(build + '/css'));
});

gulp.task('html', function() {
  return gulp.src(src + '/*.html')
    .pipe(gulp.dest(build));
});

gulp.task('html-prod', function() {
  return gulp.src(src + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(build));
});

gulp.task('js', function (cb) {
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

gulp.task('js-prod', function (cb) {
    pump(
        [
            gulp.src(src + '/js/*.js'),
            stripDebug(),
            concat(),
            babel({
                presets: ['es2015']
            }),
            uglify(),
            gulp.dest(build+'/js')
        ],
        cb
    );
});

gulp.task('prod', ['sass-prod', 'html-prod', 'js-prod']);
gulp.task('watch', function() {
    gulp.watch(src+'/js/*.js', ['js']);
    gulp.watch(src+'/scss/*.scss', ['sass']);
    gulp.watch(src+'/*.html', ['html']);
});
