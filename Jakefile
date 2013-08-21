var util = require('util'),
fs = require('fs'),
path = require('path'),
MANYOU_CSS = 'css/manyou.css',
MANYOU_LESS = 'less/manyou.less';
MANYOU_JS = 'js/manyou.js',
MANYOU_JS_MIN = 'js/manyou.min.js';

// -------------------------

desc('Install build dependencies');

task('install', {async: true}, function() {
  console.log('[install] start...');

  jake.exec('npm install --production', function(err, stdout, stderr) {
    console.log('[install] done');
    complete();
  });

});

// -------------------------

desc('Compile LESS to CSS.');

task('less', {async: true}, function () {
  console.log('[less] compile...');

  var cmd = util.format('lessc --yui-compress -x %s %s', MANYOU_LESS, MANYOU_CSS)

  jake.exec(cmd, function(err, stdout, stderr) {
    console.log('[less] done.');
    complete();
  });

});

desc('Concat js file and compress it.');

task('js', {async: true}, function () {
  console.log('[js] compile...');

  var js_core = new jake.FileList();
  js_core.include('js/manyou-core*');

  js_core = js_core.toArray();

  var js = new jake.FileList();
  js.exclude('js/manyou-core*');
  js.include('js/manyou-*');

  js = js.toArray();

  js = js_core.concat(js);

  var manyou_js = path.resolve(__dirname, MANYOU_JS);
  var cmd = [
    util.format('uglifyjs %s -b indent-level=2 -o %s', js.join(' '), MANYOU_JS),
    util.format('uglifyjs %s -c hoist_vars=true -m sort=true -o %s', js.join(' '), MANYOU_JS_MIN)
  ];

  jake.exec(cmd, function(err, stdout, stderr) {
    console.log('[js] done.');
    complete();
  });

});

desc('Copyfiles to assets.');

task('build', ['less', 'js'], function () {

  jake.addListener('complete', function () {
    jake.rmRf('css/manyou.css');
    jake.rmRf('js/manyou.js');
    jake.rmRf('js/manyou.min.js');
  });

  jake.rmRf('assets');

  var css = new jake.FileList();
  css.include('css/*');
  css.exclude('css/.*');

  jake.mkdirP('assets/css');
  css.toArray().forEach(function(file) {
    jake.cpR(file, 'assets/css');
  });

  var img = new jake.FileList();
  img.include('img/*');
  img.exclude('img/.*');
  img.exclude(/\.psd$/);

  jake.mkdirP('assets/img');
  img.toArray().forEach(function(file) {
    jake.cpR(file, 'assets/img');
  });

  var js = new jake.FileList();
  js.include('js/*.js');
  js.exclude(/\bmanyou-/);

  jake.mkdirP('assets/js');
  js.toArray().forEach(function(file) {
    jake.cpR(file, 'assets/js');
  });

  jake.cpR('fonts', 'assets');
});

// -------------------------

desc('Watch change of LESS file and compile automatically.');

task('watch-less', {async: true}, function () {
  fs.exists('docs', function(exists) {
    if (exists) {
      jake.exec('less-monitor -d ./less -o ../docs/assets/css -m manyou.less -x', {printStdout: true});
    } else {
      throw new Error('"docs" is not exist!');
    }
  });
});

// -------------------------

desc('build');

task('default', ['build']);
