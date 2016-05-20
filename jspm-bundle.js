#!/usr/bin/env node
var jspm = require('jspm');

var pkg = require('./package');

function getDepSlug (str) {
  return (str || '').replace(/[^\w-_\\/@]+/g, '');
}

function getDepFilename (deps) {
  if (typeof deps === 'string') {
    return getDepSlug(deps) + '.js';
  }
  deps = deps.map(getDepSlug);
  deps.sort();
  return deps.join('+') + '.js';
}

// Source: http://stackoverflow.com/a/5752056/5765386
function getCombinations (a, min) {
  var fn = function (n, src, got, all) {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (var j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  }
  var all = [];
  for (var i = min; i < a.length; i++) {
    fn(i, a, [], all);
  }
  all.push(a);
  return all;
}

var deps = Object.keys(pkg.jspm.dependencies);
deps.sort();

var combinations = getCombinations(deps, 1);

var builder = new jspm.Builder();

combinations.forEach(function (deps) {
  var outFile = __dirname + '/js/vendor/packages/' + getDepFilename(deps);
  builder.bundle(deps.join(' + '), {
    minify: true,
    outFile: outFile
  }).then(function () {
    console.log('[ SUCCESS ] Generated %s', outFile);
  }).catch(function (err) {
    console.error('[ FAILURE ] Failed to build %s\n', outFile, err.stack);
  });
});
