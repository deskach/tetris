define([
  'shapeView', 'shape', 'pile', 'pileView', 'factory',
  'timer', 'brick', 'brickSmall', 'layouter',
  'utils', 'constants',
  'jquiDlg',
  'panelView', 'panelElementView',

  'text!templates/gameOverDlg.html',
  'text!templates/aboutDlg.html',
  'text!templates/settingsDlg.html',

  'can', 'underscore',
],
function (
  ShapeView, Shape, Pile, PileView, factory, Timer, Brick,
  BrickSmall, Layouter,
  utils, constants,
  JQUIDlg,
  PanelView, PanelElementView,

  gameOverDlgTemplate, aboutDlgTemplate, settingsDlgTemplate
  ) {

  function destroyView(vw) {
    if (vw) {
      if (vw.hasOwnProperty('model')) {
        vw.model.destroy();
      }

      vw.unbind();
      vw.undelegateEvents();
      vw.remove();
    }
  }

  return can.Control.extend({
    defaults: {
      level2Speed: constants.gameLevel2Speed
    }
  }, {
    gameScore: 0,

    _currentLevel: 1,

    init: function (element, options) {
      var self = this;

      utils.contains(options, ['xSize', 'ySize']);

      this._level2Speed = options.level2Speed;

      //desktop key bindings
      $(document).on('keydown', function (key) {
        switch (key.keyCode) {
          case $.ui.keyCode.DOWN:
            self._moveActiveShapeDown();
            break;
          case $.ui.keyCode.UP:
            self._pileView.rotateActiveShape();
            break;
          case $.ui.keyCode.LEFT:
            self._pileView.moveActiveShape(Shape.axel.x, -1);
            break;
          case $.ui.keyCode.RIGHT:
            self._pileView.moveActiveShape(Shape.axel.x, 1);
            break;
          default:
        }
      });

      $(window).on('resize', function () {
        if (self._layouter) {
          self._layouter.layoutAll();
          self.render();
        }
      });

      //Update current level from game settings
      this.createObjects();

      this._currentLevel = this.getDifficultyLevel();
      this._oldDifficulty = constants.gameLevel2Difficulty[this._currentLevel];
      if (utils.isMob()) {
        $('.dialog_window').css('font-size', 'xx-large');
      }

      this.render();
    },

    getDifficultyLevel: function () {
      var difficulty = constants.gameDifficultyNormal;

      if (this.hasOwnProperty('_settingsDlg')) {
        difficulty = this._settingsDlg.$el.find(
          'input[name=difficulty]:checked').attr('value');

      }

      return constants.gameDifficulty2Level[difficulty];
    },

    createObjects: function () {
      var self = this,
        //isRunningOnMob = true
      isRunningOnMob = utils.isMob()
      ;

      // Instantiate jqui modal dialogs
      this._gameOverDlg = new JQUIDlg({
        dlgTempate: gameOverDlgTemplate,
        closeText: 'OK',
        buttons: [
          {
            text: 'OK',
            click: function () {
              self._gameOverDlg.$el.dialog('close');
            }
          }
        ],
        events: {
          open: function () {
            self.pause();
          },
          close: function () {
            self.restart();
          }
        }
      });

      this._aboutDlg = new JQUIDlg({
        dlgTempate: aboutDlgTemplate,
        closeText: 'OK',
        width: '350px',
        buttons: [
          {
            text: 'OK',
            click: function () {
              self._aboutDlg.$el.dialog('close');
            }
          }
        ],
        events: {
          open: function () {
            self.pause();
          },
          close: function () {
            self.run();
          }
        }
      });

      this._settingsDlg = new JQUIDlg({
        dlgTempate: settingsDlgTemplate,
        buttons: [
            {
              text: 'Play',
              click: function () {
                self._restartNeeded = true;
                self._oldDifficulty = self._settingsDlg.$el.find(
                  'input[name=difficulty]:checked').attr('value');

                self._settingsDlg.$el.dialog('close');
              }
            }
            , {
              text: 'Cancel',
              click: function () {
                self._restartNeeded = false;
                self._settingsDlg.$el.dialog('close');
              }
            }
        ],
        events: {
          open: function () {
            self.pause();

            var $radio = self._settingsDlg.$el.find(
              'input[name=difficulty]').filter(
              '[value=' + self._oldDifficulty + ']');
            $radio.prop('checked', true);
          },
          close: function () {
            if (self._restartNeeded) {
              self.restart();
            } else {
              self.run();
            }
          }
        }
      });

      //Pile represents all those bricks we have at the bottom
      this._pileView = new PileView({
        model: new Pile({
          dimensions: { // number of bricks on x/y axels
            xSize: this.options.xSize,
            ySize: this.options.ySize
          },
          Brick: Brick
        })
      });

      //Upcoming shape (the one which replaces the active shape when it is at the bottom)
      this._nextShapeView = this._createNextShape();

      // buttons
      var btnRotate = new PanelElementView({
        id: 'rotate',
        tagName: 'input',
        type: 'button',
        resizable: true,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-86-repeat.png')"
        },
        events: {
          'click': function () { self._pileView.rotateActiveShape(); }
        },
        attributes: {
          visible: isRunningOnMob
        }
      });

      var btnDown = new PanelElementView({
        id: 'down',
        tagName: 'input',
        type: 'button',
        resizable: true,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-213-down-arrow.png')"
        },
        events: {
          'click': function () { self._moveActiveShapeDown(); }
        },
        attributes: {
          visible: isRunningOnMob
        }
      });

      var btnLeft = new PanelElementView({
        id: 'left',
        tagName: 'input',
        type: 'button',
        resizable: true,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-211-left-arrow.png')"
        },
        events: {
          'click': function () {
            self._pileView.moveActiveShape(Shape.axel.x, -1);
          }
        },
        attributes: {
          visible: isRunningOnMob,
          marginBottom: PanelElementView.minHeight()
        },
      });

      var btnRight = new PanelElementView({
        id: 'right',
        tagName: 'input',
        type: 'button',
        resizable: true,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-212-right-arrow.png')"
        },
        events: {
          'click': function () {
            self._pileView.moveActiveShape(Shape.axel.x, 1);
          }
        },
        attributes: {
          visible: isRunningOnMob,
          marginBottom: PanelElementView.minHeight()
        },
      });

      // Instantiate Modal dialogs
      var btnSettings = new PanelElementView({
        id: 'tetris-settings',
        tagName: 'input',
        type: 'button',
        resizable: isRunningOnMob,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-281-settings.png')"
        },
        events: {
          'click': function () {
            self._settingsDlg.$el.dialog('open');
          }
        }
      });

      var btnAbout = new PanelElementView({
        id: 'tetris-about',
        tagName: 'input',
        type: 'button',
        resizable: isRunningOnMob,
        css: {
          'background-image': "url('styles/glyphicons/glyphicons-196-circle-info.png')"
        },
        events: {
          'click': function () {
            self._aboutDlg.$el.dialog('open');
          }
        }
      });

      this._score = new PanelElementView({
        id: 'tetris-score',
        tagName: 'lable',
        text: '0',
        css: {
          padding: 5
        }
      });

      // There are 4 panels which serve as placeholders for game controls
      // layout - determines on which side of the pile shoud the panel appear
      // elements - elements to be placed on the panel
      // splitPoint - all elements after is will be on other side of the panel
      this._panels = {
        'upanel': new PanelView({
          layout: PanelView.Layout.HU,
          elements: [btnSettings, btnAbout, this._score],
          splitPoint: 2
        }),
        'bpanel': new PanelView({
          layout: PanelView.Layout.HD,
          elements: [btnRotate, btnLeft, btnRight, btnDown],
          splitPoint: 2
        }),
        'lpanel': new PanelView({
          layout: PanelView.Layout.VL,
          elements: [btnSettings, btnAbout, btnLeft, btnRotate],
          splitPoint: 2,
          alignment: PanelView.Alignment.Right
        }),
        'rpanel': new PanelView({
          layout: PanelView.Layout.VR,
          elements: [this._score, btnRight, btnDown],
          splitPoint: 1,
          alignment: PanelView.Alignment.Left
        })
      };

      //a timer which makes the active shape fall down
      this._timer = new Timer(function () { self._moveActiveShapeDown(); });
      this._timer.ms = this._level2Speed[this._currentLevel];

      var vertical = Layouter.Layout.Vertical;
      var horizontal = Layouter.Layout.Horizontal;

      this._layouter = new Layouter(this.element, {
        pileView: this._pileView,
        nextShapeView: this._nextShapeView,
        panels: this._panels
      });

      this._layouter.layoutAll();
    },

    destroyObjects: function () {
      destroyView(this._pileView);
      destroyView(this._nextShapeView);

      _(this._panels).each(function (panel) {
        destroyView(panel);
      });
    },

    render: function () {
      var self = this;

      this.element.append(this._pileView.render().$el);
      this.element.append(this._nextShapeView.render().$el);

      _(this._panels).each(function (panel) {
        if (panel.visible) {
          self.element.append(panel.render().$el);
        } else {
          self.element.remove(panel.$el.attr('id'));
        }
      });

      $('#tetris-score').text(this.gameScore);
    },

    restart: function () {
      //Update current level from game settings
      this._currentLevel = this.getDifficultyLevel();
      this.gameScore = 0;

      this.destroyObjects();
      this.createObjects();
      this.render();
      this.run();
    },

    _createNextShape: function () {
      var nsView = new ShapeView({
        brickClass: 'tts-brick-shadowed',
        model: factory.createShape(
          factory.createRandomShapeType(),
          BrickSmall,
          0, 0)
      });

      if (this._layouter) {
        this._layouter.layoutNextShape(nsView);
      }

      return nsView;
    },

    _moveActiveShapeDown: function () {
      var self = this,
        success = this._pileView.moveActiveShape(Shape.axel.y, 1);

      if (!success) {
        var linesRemoved = this._pileView.putActiveShapeToPile();

        this.gameScore += 10 * linesRemoved;
        this._score.$el.text(this.gameScore);

        try {
          this._pileView.createActiveShape(this._nextShapeView.model.get('type'));
          this._pileView.renderActiveShape();
        } catch (e) {
          this._gameOverDlg.$el.dialog('open');

          return;
        }

        var levels = _.keys(this._level2Speed);
        var newLevel = this.getDifficultyLevel() + Math.floor(this.gameScore / 100);
        if (this._currentLevel < newLevel && newLevel <= levels[levels.length - 1]) {
          this._currentLevel = newLevel;
          this._timer.ms = this._level2Speed[this._currentLevel];
          this._timer.restart();
        }

        this._nextShapeView.remove();
        this._nextShapeView = this._createNextShape();
        this.element.append(this._nextShapeView.render().$el);
      }
    },

    run: function () {
      this._timer.start();
    },

    pause: function () {
      this._timer.stop();
    }
  })
});