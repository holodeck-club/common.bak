(function () {

var hasLoader = document.head.querySelector('script[src*="common/assets/js/lib/loader.js"]');

if (!hasLoader) {
  console.warn('[manifest-loader] Could not find A-Frame Manifest Loader');
  return;
}

// var isLocal = document.querySelector('#__bs_script__') || window.location.protocol !== 'https:';
var isLocal = false;

var registryUrls = {
  browserify: isLocal ? 'https://wzrd.in/debug-standalone/' : 'https://wzrd.in/standalone/',
  github: isLocal ? 'https://rawgit.com/' : 'https://cdn.rawgit.com/',
  npm: 'https://npmcdn.com/'
};
var defaultRegistry = 'browserify';

function getPackageUrl (path) {
  if (path[0] === '/' ||
      path[0] === '.' ||
      path.substr(0, 5) === 'http:' ||
      path.substr(0, 6) === 'https:' ||
      path.substr(0, 5) === 'file:') {
    return path;
  }

  if (path.split('@')[0].indexOf('/') !== -1) {
    // Assume GitHub.
    console.warn('[manifest-loader] GitHub currently unsupported; use npm package name instead.');
    return path;
  }

  return registryUrls[defaultRegistry] + path;
}

function getRawGitUrl (repo, ref, path) {
  ref = ref || 'master';
  return registryUrls.github + repo + '/' + ref + '/' + path;
}

function getAframeDistUrl (ref) {
  if (ref[0] === '/' ||
      ref[0] === '.' ||
      ref.substr(0, 5) === 'http:' ||
      ref.substr(0, 6) === 'https:' ||
      ref.substr(0, 5) === 'file:') {
    return ref;
  }
  return getRawGitUrl('aframevr/aframe', ref, isLocal ? 'dist/aframe.js' : 'dist/aframe.min.js');
}

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

function fetchJSON (url, cb) {
  var req = new XMLHttpRequest();
  req.open('get', url);
  req.setRequestHeader('accept', 'application/json');
  req.addEventListener('load', function () {
    var err = null;
    var response = req.response;

    // It could be a successful response but not an OK one (e.g., 3xx, 4xx).
    if (req.status === 200) {
      // `responseType` is not supported in IE <11.
      try {
        response = JSON.parse(response);
      } catch (e) {
        err = new Error('Could not parse response as JSON');
      }
    } else {
      err = new Error(req.statusText);
    }

    cb(err, response);
  });
  req.addEventListener('error', function () {
    cb(new Error('Network Error'));
  });
  req.send();
  return req;
}

function injectScripts (srcs) {
  srcs.forEach(function (src) {
    document.head.appendChild(createScript(src));
  });
}

function createScript (src) {
  var s = document.createElement('script');
  s.async = false;
  s.src = src;
  return s;
}

function createMeta (opts) {
  if (!opts) {
    return;
  }
  var m = document.createElement('script');
  Object.keys(opts).forEach(function (key) {
    m.setAttribute(key, opts[key]);
  });
  return m;
}

var manifest = document.querySelector('link[rel="manifest"]');

if (manifest) {
  var manifestUrl = manifest.href;
  console.log('[manifest-loader] Requesting manifest "%s"', manifestUrl);
  fetchJSON(manifestUrl, function (err, manifestData) {
    if (err) {
      return console.error('[manifest-loader]', err);
    }

    console.log('[manifest-loader] Manifest loaded');

    if (!manifestData.package && !manifestData.aframe) {
      return;
    }

    var scripts = manifestData.scripts || [];

    // Support browserify, npm, jspm, GitHub repo/path, direct URLs, etc.
    if (manifestData.package && manifestData.package.format === 'jspm') {
      var deps = Object.keys(manifestData.package.dependencies);
      var jsFn = '/js/vendor/packages/' + getDepFilename(deps);
      scripts.push(jsFn);
    }

    if (manifestData.aframe) {
      var viewmode = manifestData.aframe.viewmode;
      if (viewmode) {
        var meta = createMeta({name: 'viewmode', content: viewmode});
        if (meta) {
          document.head.appendChild(meta);
        }
      }
      var components = manifestData.aframe.components;
      if (manifestData.aframe.version) {
        console.log('[manifest-loader] Requesting A-Frame version "%s"', manifestData.aframe.version);
        scripts.push(getAframeDistUrl(manifestData.aframe.version));
      }
      var componentUrl;
      components.forEach(function (componentName) {
        componentUrl = getPackageUrl(componentName);
        console.log('[manifest-loader] Requesting A-Frame component "%s"', componentName);
        scripts.push(componentUrl);
      });
    }

    scripts.forEach(function (script) {
      console.log('[manifest-loader] Loading script "%s"', script);
    });

    injectScripts(scripts);
  });
}

var aframeScene = document.querySelector('a-scene');
if (aframeScene) {
  if (aframeScene.hasLoaded) {
  }
}

})();
