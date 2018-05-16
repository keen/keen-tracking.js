var gulp = require('gulp'),
    pkg = require('./package.json');

var aws = require('gulp-awspublish'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
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
      // Wipe out requirejs cooties in dependencies
      .pipe(replace('typeof define === \'function\' && define.amd', 'false'))
      // Set current version
      .pipe(replace('__VERSION__', pkg.version))
      .on('error', util.log)
    .pipe(gulp.dest('./test/unit/build/'));
});

gulp.task('test:mocha', ['test:browserify'], function () {
  return gulp.src('./test/unit/server.js', { read: false })
    .pipe(mocha({
      reporter: 'nyan',
      timeout: 5000
    }));
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
      testName: pkg.name + '.js: ' + moment().format(' ddd, MMM Do, h:mm:ss a'),
      recordScreenshots: false,
      recordVideo: true
    },
    singleRun  : true,
    action     : 'run'
  });
});

gulp.task('deploy', ['test:mocha', 'test:karma'], function() {

  if (!process.env.AWS_KEY || !process.env.AWS_SECRET) {
    throw 'AWS credentials are required!';
  }

  var publisher = aws.create({
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: 'keen-js' // pkg.name
  });

  var cacheLife = (1000 * 60 * 60 * 24 * 365); // 1 year

  var headers = {
    // Cache policy (1000 * 60 * 60 * 1) // 1 hour
    // 'Cache-Control': 'max-age=3600000, public',
    // 'Expires': new Date(Date.now() + 3600000).toUTCString()
    'Cache-Control': 'max-age=' + cacheLife + ', public',
    'Expires': new Date(Date.now() + cacheLife).toUTCString()
  };

  return gulp.src([
      './dist/keen-tracking.js',
      './dist/keen-tracking.min.js'
    ])
    .pipe(rename(function(path) {
      path.dirname += '/';
      var name = pkg.name + '-' + pkg.version;
      path.basename = (path.basename.indexOf('min') > -1) ? name + '.min' : name;
    }))
    .pipe(aws.gzip())
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(publisher.cache())
    .pipe(aws.reporter());

});

// Future: reconnect SauceLabs with Travis?
gulp.task('test:cli', ['test:mocha', 'test:phantom']);


function getCustomLaunchers(){
  return {
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
    },

    // sl_ie_7: {
    //   base: 'SauceLabs',
    //   browserName: 'internet explorer',
    //   platform: 'Windows XP',
    //   version: '7'
    // }

    sl_ios: {
      base: 'SauceLabs',
      browserName: 'iPhone',
      platform: 'OS X 10.10',
      version: '8.1'
    },
    sl_android: {
      base: 'SauceLabs',
      browserName: 'android',
      platform: 'Linux',
      version: '4.4'
    }
  };
}
