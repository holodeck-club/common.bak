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
      /** First middleware handler **/
      var pathname = require('url').parse(req.url).pathname;
      if (pathname === '/') {
        req.url = req.url.replace('/', '/common/');
        res.writeHead(301, {Location: req.url});
        res.end();
      } else if (pathname.indexOf('manifest.json') > -1 ||
                 pathname.indexOf('.css') > -1 ||
                 pathname.indexOf('.js') > -1) {
        // TODO: Rewrite `holodeck.club` URLS
        // (See https://github.com/holodeck-club/common/issues/1)
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

// TODO: Rewrite `holodeck.club` URLS
// (See https://github.com/holodeck-club/common/issues/2)
// opts.rewriteRules.push({
//   match: new RegExp('https://holodeck.club/'),
//   fn: function () {
//     return '/';
//   }
// });

module.exports = opts;
