define(['jqueryui', 'backbone', 'underscore'],
  function () {
    return Backbone.View.extend({
      _height: 40,
      _width: 40,

      className: 'tts-game-element',

      initialize: function (options) {
        Backbone.View.prototype.initialize.apply(this, arguments);

        this.$el.attr('id', options.id || _.uniqueId('v'));
        this.$el.attr('type', options.type);
        this.$el.text(options.text);
        this.resizable = (options.resizable === true);
        this.attributes = options.attributes || {};

        if (!this.attributes.hasOwnProperty('visible') || this.attributes.visible !== false) {
          this.attributes.visible = true;
        }

        if (options.css) {
          this.$el.css(options.css);
        }
      },

      render: function() {
        this.$el.css({
          width: this._width,
          height: this._height
        });

        return this;
      },

      height: function (val) {
        if (val) {
          var iVal = parseInt(val);

          if(iVal >= this.constructor.minHeight()) {
            this._height = iVal;
          } else {
            throw 'Incorrect value';
          }
        }

        return this._height;
      },

      width: function (val) {
        if (val) {
          var iVal = parseInt(val);

          if (iVal >= this.constructor.minWidth()) {
            this._width = iVal;
          } else {
            throw 'Incorrect value';
          }
        }

        return this._width;
      }
    }, {
      minHeight: function () {
        return 40;
      },

      minWidth: function () {
        return 40;
      }
    });
  });