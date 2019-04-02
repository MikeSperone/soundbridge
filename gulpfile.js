const
	config = require('./config/config'),
	gulp		= require('gulp'),
    pump  		= require('pump'),
    sass  		= require('gulp-sass'),
    sourcemaps	= require('gulp-sourcemaps'),
    autoprefixer= require('gulp-autoprefixer'),
	concat		= require('gulp-concat'),
    webpack     = require('webpack-stream');

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

gulp.task('concat-tests', function(cb) {
    return gulp.src([
                        './test/index.js',
                        // './test/soundbridge-test.js',
                        './test/play-class-test.js',
                        './test/loop-test.js',
                        './test/playgroove-test.js',
                        './test/grainread-test.js',
                        './test/playgrain-test.js'
                    ])
        .pipe(concat('all-test.js'))
        .pipe(gulp.dest('test'));
        cb(err);
});

gulp.task('test-js', ['concat-tests'], function () {
    return gulp.src('./test/all-test.js')
        .pipe(webpack({
            output: { filename: 'test-bundle.js' },
            module: { rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015' }]}
        }))
        .pipe(gulp.dest('./test/build/'));
});

gulp.task('dev', ['styles']);
gulp.task('test', ['concat-tests', 'test-js']);

gulp.task('watch:test', function() {
    gulp.watch("./test/*.js", ['test']);
});

gulp.task('watch:static', function() {
    gulp.watch(src+'/scss/*.scss', ['styles']);
});

gulp.task('watch', ['watch:test', 'watch:static']);
