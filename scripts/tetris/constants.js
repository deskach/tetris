define([], function () {
  var vertical = 'Vertical',
    horizontal = 'Horizontal',
    mixed = 'Mixed',
    vl = 'VL',
    vr = 'VR',
    hu = 'HU',
    hd = 'HD',
    easy = 'easy',
    normal = 'normal',
    hard = 'hard'
  ;

  return {
    layoutVertical: vertical,
    layoutHorizontal: horizontal,
    layoutMixed: mixed,

    panelLayoutVL: 'VL',
    panelLayoutVR: 'VR',
    panelLayoutHU: 'HU',
    panelLayoutHD: 'HD',

    layout: {
      Vertical: vertical,
      Horizontal: horizontal,
      Mixed: mixed
    },

    panelLayout: {
      VL: 'VL',
      VR: 'VR',
      HU: 'HU',
      HD: 'HD',
      Vertical: vertical,
      Horizontal: horizontal
    },

    panelAlignment: {
      Left: 'left',
      Right: 'right',
      Top: 'top',
      Bottom: 'bottom'
    },

    maxElInPanel: 4,

    gameDifficultyEasy: easy,
    gameDifficultyNormal: normal,
    gameDifficultyHard: hard,

    gameLevel2Speed: {
      1: 1000,
      2: 900,
      3: 800,
      4: 700,
      5: 600,
      6: 500,
      7: 400,
      8: 300,
      9: 200,
      10: 150
    },

    gameDifficulty2Level: {
      easy: 1,
      normal: 5,
      hard: 7
    },

    gameLevel2Difficulty: {
      1: easy,
      5: normal,
      7: hard
    }

  };
});