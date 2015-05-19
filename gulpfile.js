var gulp = require('gulp'),
    pkg = require('./package.json');

var browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    compress = require('gulp-yuicompressor')
    connect = require('gulp-connect'),
    del = require('del'),
    mocha = require('gulp-mocha'),
    rename = require('gulp-rename')
    removeEmptyLines = require('gulp-remove-empty-lines'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    stripComments = require('gulp-strip-comments'),
    util = require('gulp-util');


gulp.task('default', ['build', 'connect', 'watch']);


// -------------------------
// Build tasks
// -------------------------

gulp.task('build', ['build:browserify', 'build:minify']);

gulp.task('build:browserify', function() {
  var b = browserify({
    entries: './lib/browser.js',
    debug: true
  });
  return b.bundle()
    .pipe(source( pkg.name + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(stripComments({ line: true }))
        .pipe(removeEmptyLines())
        .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build:minify', ['build:browserify'], function(){
  return gulp.src(['./dist/' + pkg.name + '.js'])
    .pipe(compress({ type: 'js' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/'));
});


// -------------------------
// Dev tasks
// -------------------------

gulp.task('connect', ['build'], function() {
  return connect.server({
      root: [ __dirname, 'test', 'test/unit', 'test/vendor' ],
      port: 9000
    });
});

gulp.task('watch', ['connect'], function() {
  return gulp.watch([ './*.js', 'lib/**/*.js' ], ['build']);
});


// -------------------------
// Test tasks
// -------------------------

gulp.task('test:clean', function(callback){
  del(['./test/unit/build'], callback);
});

gulp.task('test:browserify', ['test:clean'], function() {
  var b = browserify({
    entries: './test/unit/browser.js',
    debug: true
  });
  return b.bundle()
    .pipe(source('browserified-tests.js'))
    .pipe(buffer())
    .on('error', util.log)
    .pipe(gulp.dest('./test/unit/build/'));
});

gulp.task('test:mocha', ['test:browserify'], function () {
  return gulp.src('./test/unit/server.js', { read: false })
  .pipe(mocha({ reporter: 'nyan' }));
});

gulp.task('with-tests', ['test:mocha', 'build', 'connect', 'watch-with-tests']);

gulp.task('watch-with-tests', function() {
  return gulp.watch([
      './*.js',
      './*lib/**/*.js',
      'test/unit/**/*.*',
      '!test/unit/build/**/*.*'
    ], ['build', 'test:mocha']);
});
