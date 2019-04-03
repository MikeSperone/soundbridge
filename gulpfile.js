const
	config = require('./config/config'),
	gulp		= require('gulp'),
    pump  		= require('pump'),
    sass  		= require('gulp-sass'),
    sourcemaps	= require('gulp-sourcemaps'),
    autoprefixer= require('gulp-autoprefixer');

const
	src   = config.src,
    build = config.build;

gulp.task('styles', function() {
   return gulp
       .src(src + '/scss/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(sourcemaps.write('maps'))
       .pipe(gulp.dest(build+'/css'));
});

gulp.task('watch', function() {
    gulp.watch(src+'/scss/*.scss', gulp.series('styles'));
});
