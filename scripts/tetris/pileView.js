/// <reference path="../lib/backbone/backbone.js" />

define(['pile', 'shape', 'shapeView', 'factory'],
  function (Pile, Shape, ShapeView, factory) {
    return Backbone.View.extend({
      tagName: 'div',

      className: 'tts-pile',

      width: function() {
        return this.model.get('dimensions').xSize * this.model.Brick.side;
      },

      height: function() {
        return this.model.get('dimensions').ySize * this.model.Brick.side;
      },

      initialize: function () {
        Backbone.View.prototype.initialize.apply(this, arguments);

        this.createActiveShape();

        this.model.on('render:newItems', this.renderNewItems, this);
        this.model.on('render:removedLines', this.renderRemovedLines, this)
        this.model.on('render:partial', this.renderPartial, this)
      },

      createActiveShape: function (shapeType) {
        shapeType = shapeType || factory.createRandomShapeType();

        var shape = factory.createShape(
            shapeType,
            this.model.Brick,
            this.model.get('dimensions').xSize / 2,
            0
          );

        if (this.model.overlapsWith(shape)) {
          throw 'failed to create active shape';
        }

        this._activeShapeView = new ShapeView({
          model: shape
        });

        return this;
      },

      removeActiveShape: function () {
        this._activeShapeView.remove();

        return this;
      },

      renderActiveShape: function () {
        if (this._activeShapeView) {
          this.$el.append(this._activeShapeView.render().$el);
        }

        return this;
      },

      moveActiveShape: function (axel, val) {
        this._activeShapeView.model.move(axel, val);

        if (this.model.overlapsWith(this._activeShapeView.model)) {
          this._activeShapeView.model.move(axel, -1 * val);

          return false;
        } else {
          this.renderActiveShape();
        }

        return true;
      },

      rotateActiveShape: function () {
        this._activeShapeView.model.rotate(Shape.rotation.clockwise);

        if (this.model.overlapsWith(this._activeShapeView.model)) {
          this._activeShapeView.model.rotate(Shape.rotation.counterClockwise);

          return false;
        } else {
          this.renderActiveShape();
        }

        return true;
      },

      putActiveShapeToPile: function() {
        var linesRemoved = this.model.addShape(this._activeShapeView.model);

        this.removeActiveShape();

        return linesRemoved;
      },

      render: function () {
        this.$el.attr('id', this.model.cid);
        this.$el.css({
          'width': this.model.get('dimensions').xSize * this.model.Brick.side,
          'height': this.model.get('dimensions').ySize * this.model.Brick.side,
        });

        this.renderActiveShape();
        this.renderPartial(this.model.get('dimensions').ySize - 1);

        return this;
      },

      renderRemovedLines: function () {
        var lines = this.model.get('removedLines'),
          items = this.model.get('items');

        for (i in lines) {
          var y = lines[i];

          for (var j = 0; j < items[y].length; j++) {
            var item = items[y][j];

            if (item) {
              var item4removal = this.$('#' + item.id);
              this.$('#' + item.id).remove();
            }
          }
        }

        return this;
      },

      renderNewItems: function () {
        var self = this;

        _(this.model.get('newItems')).each(function (item) {
          var $item = self._createPileElement(item),
            oldItem = self.model.get('items')[item.idx.y][item.idx.x];

          if (oldItem) {
            self.$('#' + oldItem.id).remove();
          }

          self.$el.append($item);
        });

        return this;
      },

      renderPartial: function (start) {
        var start = start || this.model.get('startingLine4Rendering'),
          items = this.model.get('items'),
          hight = this.model.get('hight');

        for (var i = start; i >= hight; i--) {
          for (var j = 0; j < items[i].length; j++) {
            var item = items[i][j];

            if (item) {
              this.$('#' + item.id).remove();
              this.$el.append(this._createPileElement(item));
            }
          }
        }
      },

      _createPileElement: function (item) {
        var $item = $('<div></div>');
        var xpx = item.idx.x * this.model.Brick.side;
        var ypx = item.idx.y * this.model.Brick.side;

        $item.attr('id', item.id);
        $item.addClass('tts-pile-item');
        $item.css({
          'left': xpx,
          'top': ypx,
          'width': this.model.Brick.side + 'px',
          'height': this.model.Brick.side + 'px',
          'background-color': item.color
        });

        return $item;
      }
    });
  });