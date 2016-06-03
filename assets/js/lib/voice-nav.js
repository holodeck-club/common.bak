(function () {
  if (!('annyang' in window)) {
    return;
  }

  var strip = function (str) {
    return (str || '').trim();
  };

  var goBack = function () {
    console.log('go back');
    window.history.go(-1);
  };

  var goForward = function () {
    console.log('go forward');
    window.history.go(1);
  };

  // Monkeypatch Annyang :)
  var initSpeech = annyang.addItems = function (data) {
    if (!annyang) { return; }

    console.log(JSON.stringify(data, null, 2));

    choices = (data || []).map(function (item) {
      if (typeof item !== 'object') {
        item = {title: item};
      }
      item.title = (item.title || item.slug || '').replace(/&/g, 'and');
      return item;
    });

    var speechCmds = {
      back: goBack,
      forward: goForward
    };

    addSpeechCmd(choices[0], 'first');
    addSpeechCmd(choices[0], 'start');
    addSpeechCmd(choices[0], 'beginning');
    // addSpeechCmd(choices[choices.length - 1], 'last');
    addSpeechCmd(choices[choices.length - 1], 'end');

    addSpeechCmd(choices[0], 'the first');
    addSpeechCmd(choices[0], 'the start');
    addSpeechCmd(choices[0], 'the beginning');
    // addSpeechCmd(choices[choices.length - 1], 'the last');
    addSpeechCmd(choices[choices.length - 1], 'the end');

    function addSpeechCmd (example, title) {
      if (!title) { title = example.title; }

      var cmdFunc = function () { loadExample(example); };

      // TODO: Use regular expressions more.
      speechCmds[title] = cmdFunc;

      speechCmds['go ' + title] = cmdFunc;
      speechCmds['go *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['go *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['go *x ' + title + ' (world)'] = cmdFunc;

      speechCmds['skip to ' + title] = cmdFunc;
      speechCmds['skip to *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['skip to *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['skip to *x ' + title + ' (world)'] = cmdFunc;

      speechCmds['play ' + title] = cmdFunc;
      speechCmds['play *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['play *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['play *x ' + title + ' (world)'] = cmdFunc;

      speechCmds['open ' + title] = cmdFunc;
      speechCmds['open *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['open *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['open *x ' + title + ' (world)'] = cmdFunc;

      speechCmds['load ' + title] = cmdFunc;
      speechCmds['load *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['load *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['load *x ' + title + ' (world)'] = cmdFunc;

      speechCmds['start ' + title] = cmdFunc;
      speechCmds['start *x ' + title + ' (one)'] = cmdFunc;
      speechCmds['start *x ' + title + ' (scene)'] = cmdFunc;
      speechCmds['start *x ' + title + ' (world)'] = cmdFunc;

      (title || '').split(' ').forEach(function (keyword) {
        if (keyword in speechCmds) {
          return;
        }
        addSpeechCmd(example, keyword);
      });
    }

    choices.forEach(function (example) {
      addSpeechCmd(example);
    });

    function loadExample (example) {
      if (!example) { return; }
      console.log('Loading example: %s', example.title);
      window.location.href = example.slug + '.html';
    }

    // // OPTIONAL: activate debug mode for detailed logging in the console.
    annyang.debug();

    // // OPTIONAL: Set a language for speech recognition (defaults to English)
    // // For a full list of language codes, see the documentation:
    // // https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
    annyang.setLanguage(document.documentElement.getAttribute('lang') || 'en');

    Object.keys(speechCmds).forEach(function (key) {
      if (key.indexOf('computer') === -1) {
        speechCmds['(computer) ' + key] = speechCmds[key];
        delete speechCmds[key];
      }
    });

    console.log('>', speechCmds);
    annyang.addCommands(speechCmds);

    annyang.addCallback('resultNoMatch', function (userSaid, commandText, phrases) {
      console.log('resultNoMatch', userSaid, userSaid.map(strip), speechCmds);
      if (!userSaid) { return; }

      userSaid = userSaid.map(strip);

      if (userSaid.indexOf('back') !== -1 ||
          userSaid.indexOf('previous') !== -1 ||
          userSaid.indexOf('backward') !== -1 ||
          userSaid.indexOf('backwards') !== -1 ||
          userSaid.indexOf('reverse') !== -1) {
        goBack();
        return;
      }

      if (userSaid.indexOf('next') !== -1 ||
          userSaid.indexOf('forward') !== -1 ||
          userSaid.indexOf('forwards') !== -1 ||
          userSaid.indexOf('skip') !== -1 ||
          userSaid.indexOf('pass') !== -1) {
        goForward();
        return;
      }

      var i = 0;
      var j = 0;
      var phrase = '';
      var words = [];
      var word = '';

      for (i = 0; i < userSaid.length; i++) {
        phrase = userSaid[i];

        words = phrase.split(' ');

        if (words.indexOf('backward') !== -1 ||
            words.indexOf('backwards') !== -1) {
          goBack();
          return;
        }
        if (words.indexOf('forward') !== -1 ||
            words.indexOf('forwards') !== -1) {
          goForward();
          return;
        }

        if (words.indexOf('back') !== -1 ||
            words.indexOf('previous') !== -1 ||
            words.indexOf('last') !== -1) {
          // Disclaimer: last could be confused with last item.
          goBack();
          return;
        }
        if (words.indexOf('next') !== -1) {
          goForward();
          return;
        }
      }
    });

    window.addEventListener('keypress', function (e) {
      if (e.keyCode === 118) {  // `v`
        toggleSpeechRecognition();
      }
    });

    window.addEventListener('click', function (e) {
      if (e.detail >= 3) {  // triple click
        toggleSpeechRecognition();
      }
    });

    window.addEventListener('load', function () {
      setTimeout(function () {
        toggleSpeechRecognition();
      }, 2000);
    });

    // window.addEventListener('vrdisplaypresentchange', toggleSpeechRecognition);

    function toggleSpeechRecognition () {
      annyang.start();
      // if (annyang.isListening()) {
      //   console.log('Pausing voice recognition');
      //   annyang.pause();
      // } else {
      //   console.log('Starting voice recognition');
      //   annyang.start();
      // }
    }
  }
})();
