const webpackConfig = require('./config/webpack.config.js');
const
	config = require('./config/config'),

	gulp		= require('gulp'),
    webserver	= require('gulp-webserver'),
    //babel		= require('gulp-babel'),
    pump  		= require('pump'),
    sass  		= require('gulp-sass'),
    sourcemaps	= require('gulp-sourcemaps'),
    autoprefixer= require('gulp-autoprefixer'),
    htmlmin		= require('gulp-htmlmin'),

	concat		= require('gulp-concat'),
    stripDebug	= require('gulp-strip-debug'),
    uglify		= require('gulp-uglify'),

    webpack     = require('webpack-stream');

const
	src   = config.src,
    build = config.build,
	host  = config.host;

gulp.task('styles', function() {
   return gulp
       .src(src + '/scss/*.scss')
       .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer())
       .pipe(sourcemaps.write('maps'))
       .pipe(gulp.dest(build+'/css'));
});

gulp.task('prod-html', function() {
  return gulp.src(src + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(build));
});

gulp.task('copyjslib', function() {
    return gulp.src(src + '/js/AudioContextMonkeyPatch.js')
        .pipe(gulp.dest(build + '/js/'));
});

gulp.task('concat-tests', function(cb) {
    return gulp.src([
                        './test/index.js',
                        // './test/soundbridge-test.js',
                        './test/play-class-test.js',
                        // './test/loop-test.js',
                        // './test/playgroove-test.js',
                        // './test/grainread-test.js',
                        // './test/playgrain-test.js'
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

gulp.task('js:pack', function () {
    return gulp.src(src + '/js/index.js')
        .pipe(webpack({
            output: { filename: 'bundle.js' },
            module: { rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015' }]}
        }))
        .pipe(gulp.dest(build + '/js/'));
});

gulp.task('dev-html', function() {
  return gulp.src(src + '/*.html')
    .pipe(gulp.dest(build));
});

gulp.task('server', ['webserver', 'watch']);
gulp.task('dev', ['copyjslib', 'js:pack', 'styles', 'dev-html']);
gulp.task('production', ['prod-js', 'styles', 'prod-html']);
gulp.task('test', ['concat-tests', 'test-js']);

gulp.task('watch:test', function() {
    gulp.watch("./test/*.js", ['test']);
});

gulp.task('watch:static', function() {
    gulp.watch(src+'/js/*.js', ['dev-js']);
    gulp.watch(src+'/scss/*.scss', ['styles']);
    gulp.watch(src+'/*.html', ['dev-html']);
});

gulp.task('watch', ['watch:test', 'watch:static']);

