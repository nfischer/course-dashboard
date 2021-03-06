var gulp = require('gulp'),
    gutil = require('gulp-util'),
    babelify = require('babelify'),
    brfs = require('brfs'),
    browserify = require('browserify'),
    resolutions = require('browserify-resolutions'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    partial = require('partial'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    buffer = require('vinyl-buffer')
    watch = require('gulp-watch'),
    mergeStream = require('merge-stream'),
    concat = require('gulp-concat');

var b = browserify({
    entries: 'index.js',
    basedir: 'src/',
    debug: true
  })
  .plugin(resolutions, ['react', 'react-dom', 'jquery'])
  .transform(babelify, {presets: ['es2015', 'react'],
                        plugins: ["transform-class-properties"]});

var b2 = browserify({
    entries: 'webapi.js',
    basedir: 'coursecreation/',
    debug: true
  })
  .plugin(resolutions, ['react', 'react-dom', 'jquery'])
  .transform(babelify);

var updateBundle = function(b){
  b.bundle()
    //.on('error', gutil.log)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'));
};

var updateBundle2 = function(b){
  b2.bundle()
    //.on('error', gutil.log)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./coursecreation'));
};

gulp.task('build_browser', partial(updateBundle, b));
gulp.task('build_coursecreation', partial(updateBundle2, b));
