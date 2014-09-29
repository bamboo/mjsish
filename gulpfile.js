require('source-map-support').install();

var gulp = require('gulp');
var mjs = require('gulp-mjs');
var mocha = require('gulp-mocha');
var es = require('event-stream');
var path = require('path');

var paths = {
    src: ['lib/**/*.mjs', 'bin/**/*.mjs'],
    dest: '.',
    test: {
      src: ['test/*.mjs'],
      lib: ['test/lib/*.mjs']
    }
};

function build() {
  return compile(paths.src, paths.dest);
}

function compile(src) {
  return pipeline(
    gulp.src(src, {base: '.'}),
    mjs({debug: true}),
    gulp.dest(paths.dest))
  .on('error', onError);
}

function pipeline() {
  return es.pipeline.apply(null, arguments);
}

var javascriptFiles = es.map(function (data, callback) {
  if (isJavascriptFile(data))
    callback(null, data);
  else
    callback();
});

function test() {
  return pipeline(
    compile(paths.test.src),
    javascriptFiles,
    mocha({reporter: 'spec'}));
}

function testLib() {
  return compile(paths.test.lib);
}

function isJavascriptFile(f) {
  return f.path && path.extname(f.path) == '.js';
}

function onError(err) {
  console.warn(err.stack || err.message || err.toString());
}

gulp.task('build', build);

gulp.task('test-lib', testLib);

gulp.task('test', ['build', 'test-lib'], test);

gulp.task('default', ['test']);
