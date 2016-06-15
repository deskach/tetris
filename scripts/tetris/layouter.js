define(['utils', 'panelView', 'constants', 'can'],
  function (utils, PanelView, constants) {
    return can.Control.extend({
      Layout: constants.layout,

      defaults: {
        layout: constants.layout.Vertical
      }
    }, {

      _checkViewBeforeLayouting: function (vw, localViewName) {
        if (vw) {
          this[localViewName] = vw;
        }

        return this[localViewName];
      },

      init: function (element, options) {
        options = options || {};

        this._pileView = options.pileView;
        this._nextShapeView = options.nextShapeView;
        this._panels = options.panels;
      },

      layoutAll: function () {
        this.layoutPile();
        this.layoutNextShape();
        this.layoutPanels();
      },

      layoutPile: function (pileView) {
        pileView = this._checkViewBeforeLayouting(pileView, '_pileView');

        if (pileView) {
          var gameHeight = this.element.height();
          var gameWidth = this.element.width();
          var xSize = pileView.model.get('dimensions').xSize;
          var ySize = pileView.model.get('dimensions').ySize;

          // The width of the game when all panels are vertical
          var gameWidthVV = gameWidth - _(this._panels).reduce(
            function (memo, pnlView) {
              if (pnlView.layoutIs(constants.layout.Vertical)) {
                memo += pnlView.minWidth();
              }

              return memo;
            }, 0);

          var gameHeightHH = gameHeight - _(this._panels).reduce(
            function (memo, pnlView) {
              if (pnlView.layoutIs(constants.layout.Horizontal)) {
                memo += pnlView.minHeight();
              }

              return memo;
            }, 0);

          var brickSideVV = Math.min(
            Math.floor(gameWidthVV / xSize),
            Math.floor(gameHeight / ySize)
          );
          var brickSideHH = Math.min(
            Math.floor(gameWidth / xSize),
            Math.floor(gameHeightHH / ySize)
          );

          var brickSide = 0;

          if (brickSideVV >= brickSideHH) {
            this.layout = constants.layout.Vertical;
            brickSide = brickSideVV;
          } else {
            this.layout = constants.layout.Horizontal;
            brickSide = brickSideHH;
          }
          pileView.model.Brick.side = brickSide

          var left = Math.floor((gameWidth - pileView.width()) / 2),
            top = Math.floor((gameHeight - pileView.height()) / 2);

          pileView.$el.css({
            left: left,
            top: top
          });
        }
      },

      layoutPanels: function () {
        var pileView = this._pileView,
          gameHeight = this.element.height(), gameWidth = this.element.width(),
          pileLeft = 0, pileTop = 0, pileWidth = 0, pileHeight = 0,
          pileBorder = 0,
          margin = PanelView.elMargin
        ;

        if (pileView) {
          pileLeft = parseInt(pileView.$el.css('left')) || 0;
          pileTop = parseInt(pileView.$el.css('top')) || 0;
          pileWidth = pileView.width();
          pileHeight = pileView.height();
          pileBorder = parseInt(pileView.$el.css('border')) || 0;
        }

        _(this._panels).each(function (panel) {
          panel.visible = false;
        });

        if (this.layout === constants.layout.Vertical) {
          if (this._panels.lpanel) {
            this._panels.lpanel.height(pileHeight);
            this._panels.lpanel.width(
              Math.floor((gameWidth - pileWidth - 2 * margin) / 2));
            this._panels.lpanel.visible = true;
          }

          if (this._panels.rpanel) {
            this._panels.rpanel.height(pileHeight);
            this._panels.rpanel.width(
              Math.floor((gameWidth - pileWidth - 2 * margin) / 2));

            this._panels.rpanel.$el.css({
              left: pileLeft + pileWidth + 2 * pileBorder + margin,
            });
            this._panels.rpanel.visible = true;
          }
        } else if (this.layout === constants.layout.Horizontal) {
          if (this._panels.upanel) {
            this._panels.upanel.width(pileWidth);
            this._panels.upanel.height(this._panels.upanel.minHeight());
            this._panels.upanel.$el.css({
              left: pileLeft,
              top: 0,
            });
            this._panels.upanel.visible = true;
          }

          if (this._panels.bpanel) {
            this._panels.bpanel.width(pileWidth);
            this._panels.bpanel.height(this._panels.upanel.minHeight());
            this._panels.bpanel.$el.css({
              left: pileLeft,
              top: pileTop + pileHeight + 2 * pileBorder,
            });
            this._panels.bpanel.visible = true;
          }
        }
      },

      layoutNextShape: function (nextShapeView) {
        nextShapeView = this._checkViewBeforeLayouting(nextShapeView,
          '_nextShapeView');

        if (nextShapeView) {
          var left = 0, top = 0;

          if (this._pileView) {
            var brickSide = Math.floor(this._pileView.model.Brick.side / 2);
            nextShapeView.model.get('bricks').at(0).constructor.side = brickSide;

            left = parseInt(this._pileView.$el.css('left'));
            //left += this._pileView.$el.width();
            //left -= brickSide * (nextShapeView.model.max('x') + 1);
            left += brickSide * Math.abs(nextShapeView.model.min('x'));
            top = parseInt(this._pileView.$el.css('top'));
          }

          nextShapeView.$el.css({
            top: top,
            left: left
          });
        }
      }
    });
  });