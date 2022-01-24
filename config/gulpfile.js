const
	gulp		= require('gulp'),
    sass  		= require('gulp-sass'),
    sourcemaps	= require('gulp-sourcemaps'),
    autoprefixer= require('gulp-autoprefixer');

gulp.task('styles', function() {
   return gulp
       .src('src/scss/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(sourcemaps.write('maps'))
       .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/scss/*.scss', gulp.series('styles'));
});
