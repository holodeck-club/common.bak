/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */

var fs = require('fs');
var path = require('path');

var REMOTE_URL_REGEX = new RegExp('https?://(www\.)?holodeck.club/', 'gi');
var REMOTE_URL_REGEX_REPLACER = '/';

function isEnabled (val) {
  val = val || '';
  return val !== '' && val !== '0' && val !== 'false' && val !== 'off';
}

function getEnvVar (name, defaultVal) {
  return name in process.env ? isEnabled(name) : defaultVal;
}

var isDev = process.env.NODE_ENVIRONMENT === 'development';

var opts = {
  server: {
    baseDir: process.env.HOLODECK_CLUB_PATH || '../',
    routes: {
      '/': 'common/'
    }
  },
  middleware: [
    function (req, res, next) {
      var pathname = require('url').parse(req.url).pathname;
      if (pathname === '/') {
        // Have `/` redirect to `/common/` (which redirects to `/lobby/`).
        req.url = req.url.replace('/', '/common/');
        res.writeHead(301, {Location: req.url});
        res.end();
      } else if (pathname.indexOf('manifest.json') > -1 ||
                 pathname.indexOf('.css') > -1 ||
                 pathname.indexOf('.js') > -1) {
        // Rewrite `holodeck.club` URLs.
        var readableStream = fs.createReadStream(
          path.join(__dirname, '..', req.originalUrl),
          {encoding: 'utf8'}
        );
        var data = '';
        var chunk;
        readableStream.on('readable', function () {
          while ((chunk = readableStream.read()) !== null) {
            data += chunk;
          }
        });
        readableStream.on('end', function() {
          res.end(data.replace(REMOTE_URL_REGEX, REMOTE_URL_REGEX_REPLACER));
        });
        return;
      }
      return next();
    }
  ],
  rewriteRules: [],
  files: [
    '**',
    '!*\.{7z,com,class,db,dll,dmg,exe,gz,iso,jar,o,log,so,sql,sqlite,tar,zip}',
    '!node_modules'
  ],
  watchOptions: {
    ignoreInitial: true
  },
  open: getEnvVar('BS_OPEN', false),
  notify: getEnvVar('BS_NOTIFY', false),
  tunnel: getEnvVar('BS_TUNNEL', false),
  minify: getEnvVar('BS_MINIFY', isDev)
};

// Rewrite `holodeck.club` URLs.
opts.rewriteRules.push({
  match: REMOTE_URL_REGEX,
  fn: function () {
    return REMOTE_URL_REGEX_REPLACER;
  }
});

module.exports = opts;
