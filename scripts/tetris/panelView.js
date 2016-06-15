define(['constants', 'jqueryui', 'backbone', 'underscore'],
  function (constants) {
    return Backbone.View.extend({
      className: 'tts-game-panel',

      elements: [],

      layout: constants.panelLayout.Vertical,

      visible: false,

      _width: undefined,
      _height: undefined,

      initialize: function (options) {
        Backbone.View.prototype.initialize.apply(this, arguments);

        this.options = options;
        this.layout = options.layout;
        this.elements = options.elements;
        this.positioning = options.positioning;
        this.splitPoint = options.splitPoint;
        this.$el.attr('id', _.uniqueId('v'));
        this._width = this.minWidth();
        this._height = this.minHeight();
      },

      render: function () {
        this.$el.css({
          width: this.width(),
          height: this.height()
        });

        for (var i = 0; i < this.elements.length; i++) {
          var pnlEl = this.elements[i],
            elTop = 0,
            elLeft = 0;

          if (!pnlEl.attributes.visible) {
            continue;
          }

          if (pnlEl.resizable) {
            if (this.layoutIs(constants.layout.Vertical)) {
              var newWidth = this.width() - 2 * this.constructor.elMargin;
              var newHeight = Math.floor(
                this.height() / constants.maxElInPanel);
              var newVal = Math.min(newWidth, newHeight);
              this._tryResizeElementWidth(pnlEl, newVal);
              this._tryResizeElementHeight(pnlEl, newVal);
            } else {
              this._tryResizeElementWidth(pnlEl, pnlEl.constructor.minWidth());
              this._tryResizeElementHeight(pnlEl, pnlEl.constructor.minHeight());
            }
          }

          if (i >= this.splitPoint) {
            var j = this.elements.length - i;

            if (this.layoutIs(constants.layout.Vertical)) {
              var mBottom = pnlEl.attributes.marginBottom || 0;

              elTop = parseInt(this.height()) - pnlEl.height() * j - mBottom;
              elLeft = Math.floor((this.width() - pnlEl.width()) / 2) + this.constructor.elMargin;
            } else {
              elLeft = parseInt(this.width()) - pnlEl.width() * j + this.constructor.elMargin;
            }
          } else {
            if (this.layoutIs(constants.layout.Vertical)) {
              elTop = pnlEl.height() * i + this.constructor.elMargin;

              if (this.options.alignment === constants.panelAlignment.Right) {
                elLeft = this.width() - pnlEl.width();
              } else {
                elLeft = 0;
              }
            } else {
              elLeft = pnlEl.width() * i + this.constructor.elMargin;
            }
          }

          pnlEl.$el.css({
            'left': elLeft,
            'top': elTop,
          });

          this.$el.append(pnlEl.render().$el);
        }

        return this;
      },

      height: function (val) {
        if (val !== undefined) {
          if (val >= this.minHeight()) {
            this._height = val;
          } else {
            this._height = this.minHeight();
          }
        }

        return this._height;
      },

      minHeight: function () {
        var height = 0;

        if (this.layoutIs(constants.layout.Vertical)) {
          _(this.elements).each(function (el) {
            height += el.constructor.minHeight();
          });
        } else {
          height = _(this.elements).max(function (el) {
            return el.constructor.minHeight();
          }).height();
        }

        return height;
      },

      width: function (val) {
        if (val !== undefined) {
          if (val >= this.minWidth()) {
            this._width = val;
          } else {
            this._width = this.minWidth();
          }
        }

        return this._width;
      },

      minWidth: function () {
        var width = 0;

        if (this.layoutIs(constants.layout.Vertical)) {
          width = _(this.elements).max(function (el) {
            return el.constructor.minWidth();
          }).width()
        } else {
          _(this.elements).each(function (el) {
            width += el.constructor.minWidth();
          })
        }

        return width;
      },

      _tryResizeElementWidth: function (el, value) {
        if (el.resizable) {
          if (value > this.constructor.maxElWidth) {
            value = this.constructor.maxElWidth;
          }

          try {
            el.width(value);
          } catch (e) {
            el.width(el.constructor.minWidth());
          }
        }
      },

      _tryResizeElementHeight: function (el, value) {
        if (el.resizable) {
          if (value > this.constructor.maxElHeight) {
            value = this.constructor.maxElHeight;
          }

          try {
            el.height(value);
          } catch (e) {
            el.height(el.constructor.minHeight());
          }
        }
      },

      layoutIs: function (layoutType) {
        var result = false;

        if (layoutType === constants.layout.Vertical) {
          result = (this.layout === this.constructor.Layout.VL) ||
            (this.layout === this.constructor.Layout.VR);
        } else if (layoutType === constants.layout.Horizontal) {
          result = (this.layout === this.constructor.Layout.HU) ||
            (this.layout === this.constructor.Layout.HD);
        }

        return result;
      }
    }, {
      Layout: constants.panelLayout,
      Alignment: constants.panelAlignment,
      elMargin: 1,
      maxElWidth: 120,
      maxElHeight: 120
    });
  });