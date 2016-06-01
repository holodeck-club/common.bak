/* global annyang */
(function () {
  if (!('annyang' in window)) {
    return;
  }
  if (annyang.addItems) {
    annyang.addItems([
      {
        title: 'Carnival Globe Trees',
        slug: 'carnivalglobetrees'
      },
      {
        title: 'Meditation Orbs',
        slug: 'meditationorbs'
      },
      {
        title: 'Moss March',
        slug: 'mossmarch'
      },
      {
        title: 'Over Water',
        slug: 'overwater'
      },
      {
        title: 'Redwood Dusk',
        slug: 'redwooddusk'
      },
      {
        title: 'Sequoia Scene',
        slug: 'sequoiascene'
      },
      {
        title: 'Space Blob Towers',
        slug: 'spaceblobtowers'
      }
    ]);
  }
  annyang.start();
})();
