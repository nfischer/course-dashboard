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

function watch_browser(){
  w = watchify(b);
  w.on("update", partial(updateBundle, w));
  updateBundle(w);
}
//
var updateBundle = function(b){
  b.bundle()
    //.on('error', gutil.log)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js'));
};

function build_node(){
  var polyfill = './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js';

  return gulp.src("src/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(babel({ optional: ['runtime'] }))
      //.pipe(concat("all.js"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist_node"));
}

function watch_node(){
  var polyfill = './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js';

  return gulp.src("src/**/*.js")
      .pipe(watch("src/**/*.js", {verbose: true}))
      .pipe(sourcemaps.init())
      .pipe(babel({ optional: ['runtime'] }))
      //.pipe(concat("all.js"))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("dist_node"));
}

gulp.task('build_browser', partial(updateBundle, b));
gulp.task('watch_browser', watch_browser);

gulp.task('build_node', build_node);
gulp.task('watch_node', watch_node);
