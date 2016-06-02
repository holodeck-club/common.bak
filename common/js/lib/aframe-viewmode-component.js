/* global AFRAME */
(function () {
  if ('AFRAME' in window && typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }

  var queryParams = AFRAME.utils.queryParams;

  var parseMetaContent = function (tag) {
    var obj = {};
    var content = typeof tag === 'string' ? tag : tag.content;
    if (!content) { return; }
    var pairs = content.split(',');
    if (pairs.length === 1) { pairs = content.split(';'); }  // Check for `;` just in case.
    pairs.forEach(function (item) {
      var chunks = item.replace(/[\s;,]+/g, '').split('=');
      if (chunks.length !== 2) { return; }
      obj[chunks[0]] = chunks[1];
    });
    return obj;
  };

  window.addEventListener('load', function () {
    var sceneTags = document.querySelectorAll('a-scene');
    Array.prototype.forEach.call(sceneTags, function (scene) {
      scene.setAttribute('viewmode', '');
    });
  });

  /**
   * Viewmode component for A-Frame.
   */
  AFRAME.registerComponent('viewmode', {
    dependencies: ['vr-mode-ui'],

    schema: {
      enabled: {default: true}
    },

    init: function () {
      console.log('viewmode init');
    },

    autoload: function () {
      console.log('viewmode enter');
      var scene = this.el;
      if (this.entered) { return false; }
      var projection = '';
      var metaViewmodeTags = document.head.querySelectorAll('meta[name="viewmode"]');
      Array.prototype.forEach.call(metaViewmodeTags, function (tag) {
        var val = parseMetaContent(tag);
        if (val && val.projection) {
          projection = val.projection;
        }
      });
      if (projection === 'stereo') {
        return this.enterVR();
      }
      if (projection === 'mono') {
        return this.exitVR();
      }
    },

    enterVR: function () {
      var self = this;
      var scene = self.el;
      // console.log('entering vr', scene.enterVR());
      return scene.enterVR().then(function () {
        self.entered = true;
      }).catch(function (err) {
        self.entered = true;  // We tried.
        if (err) { console.warn(err); }
      });
    },

    exitVR: function () {
      var self = this;
      var scene = self.el;
      scene.exitVR().then(function () {
        self.entered = false;
      }).catch(function () {
        self.entered = false;
      });
    },

    update: function () {
      if (!this.data.enabled || queryParams.viewmode === 'false') { return; }
      return this.autoload();
    },

    remove: function () {
      console.log('viewmode remove');
      this.exitVR();
    }
  });
})();
