var gulp = require('gulp'),
    pkg = require('./package.json');

var browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    compress = require('gulp-yuicompressor')
    connect = require('gulp-connect'),
    del = require('del'),
    karma = require('karma').server,
    mocha = require('gulp-mocha'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    moment = require('moment'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    stripComments = require('gulp-strip-comments'),
    util = require('gulp-util');


gulp.task('default', ['build', 'connect', 'watch']);


// -------------------------
// Build tasks
// -------------------------

gulp.task('build', ['build:browserify', 'build:minify', 'test:browserify']);

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
        .pipe(replace('__VERSION__', pkg.version))
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

gulp.task('minify-loader', function(){
  return gulp.src(['./lib/browser-async.js'])
    .pipe(compress({
      nomunge: 0,
      type: 'js'
    }))
    .pipe(rename({ basename: 'keen-loader', suffix: '.min' }))
    .pipe(gulp.dest('./dist/'));
});


// -------------------------
// Dev tasks
// -------------------------

gulp.task('connect', ['build'], function() {
  return connect.server({
      root: [ __dirname, 'test', 'test/demo', 'test/unit', 'test/vendor' ],
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

gulp.task('test:phantom', ['build', 'test:browserify'], function () {
  return gulp.src('./test/unit/index.html')
    .pipe(mochaPhantomJS())
    .once('error', function () {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('test:karma', ['build', 'test:browserify'], function (done){
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test:sauce', ['build', 'test:browserify'], function(){
  karma.start({
    browsers: Object.keys(getCustomLaunchers()),
    browserDisconnectTimeout: 10 * 1000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 20 * 1000,
    captureTimeout: 300 * 1000,
    configFile : __dirname + '/karma.conf.js',
    customLaunchers: getCustomLaunchers(),
    logColors: true,
    reporters: [ 'saucelabs' ],
    sauceLabs: {
      testName: moment().format('ddd, MMM Do, h:mm:ss a'),
      recordScreenshots: false,
      recordVideo: true
    },
    singleRun  : true,
    action     : 'run'
  });
});

gulp.task('watch-with-tests', function() {
  return gulp.watch([
      './*.js',
      './*lib/**/*.js',
      'test/unit/**/*.*',
      '!test/unit/build/**/*.*'
    ], ['build', 'test:mocha']);
});

gulp.task('with-tests', ['test:mocha', 'build', 'connect', 'test:karma', 'watch-with-tests']);

// Future: reconnect SauceLabs with Travis?
gulp.task('test:cli', ['test:mocha', 'test:phantom']);


function getCustomLaunchers(){
  return {
    sl_ios: {
      base: 'SauceLabs',
      browserName: 'iPhone',
      platform: 'OS X 10.9',
      version: '8.1'
    },
    sl_android: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4'
    },

    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    sl_ie_8: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows XP',
      version: '8'
    }
    // sl_ie_7: {
    //   base: 'SauceLabs',
    //   browserName: 'internet explorer',
    //   platform: 'Windows XP',
    //   version: '7'
    // }
  };
}
