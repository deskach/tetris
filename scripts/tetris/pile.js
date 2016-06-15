/// <reference path="../lib/backbone/backbone.js" />
/// <reference path="shape.js" />

define(['shape', 'utils'], function (Shape, utils) {
  var requiredItemFields = ['idx', 'color', 'id'];

  return Backbone.Model.extend({
    defaults: {
      dimensions: { // number of bricks on x/y axels
        xSize: 10,
        ySize: 20,
      }
    },

    initialize: function (options) {
      utils.contains(options, ['Brick']);

      var x = this.get('dimensions').xSize,
        y = this.get('dimensions').ySize,
        items = [];

      for (var i = 0; i < y; i++) {
        items.push([]);

        for (var j = 0; j < x; j++) {
          items[i].push(null);
        }
      }

      this.Brick = options.Brick;

      //'Private' members
      this.set('items', items);
      this.set('newItems', []);
      this.set('hight', items.length);
    },

    overlapsWith: function (shape) {
      var self = this;
      var items = this.get('items');

      var overlapmentFound = shape.get('bricks').some(function (brick) {
        var c = shape.get('center');
        var i = {
          x: c.x + brick.get('x'),
          y: c.y + brick.get('y')
        };

        if (i.x < 0 || i.x > items[0].length - 1) {
          return true;
        } else if (i.y < 0 || i.y > items.length - 1) {
          return true;
        } else if (items[i.y][i.x]) {
          return true;
        }
      });

      return overlapmentFound;
    },

    addShape: function (shape) {
      var center = shape.get('center'),
        color = shape.get('color'),
        self = this,
        hight = this.get('hight');

      shape.get('bricks').each(function (brick) {
        var i = {
          x: brick.get('x') + center.x,
          y: brick.get('y') + center.y
        };
        var newItem = utils.contains({
          idx: i,
          color: color,
          id: _.uniqueId('p')
        }, requiredItemFields);

        self.get('newItems').push(newItem);
        if (i.y < hight) {
          hight = i.y;
        }
      })

      this.set('hight', hight);
      this.trigger('render:newItems');

      var linesRemoved = this._processNewItems();

      return linesRemoved;
    },

    _processNewItems: function () {
      var newItems = this.get('newItems'),
        items = this.get('items'),
        affectedLines = {},
        item = null,
        removedLines = [];

      while (item = newItems.shift()) {
        items[item.idx.y][item.idx.x] = item;
        affectedLines[item.idx.y] = 1;
      }

      // check if the pile can be reduced
      _(Object.keys(affectedLines)).each(function (y) {
        var completed = _(items[y]).every();

        if (completed) {
          removedLines.push(y);
        }
      }, this);

      if (removedLines.length) {
        // reduce the pile and re-render the view
        this.set('removedLines', removedLines);
        this.trigger('render:removedLines');

        this._reduce(removedLines);

        removedLines.sort();
        this.set('startingLine4Rendering', removedLines[removedLines.length - 1]);
        this.trigger('render:partial');

        this.unset('removedLines');
        this.unset('startingLine4Rendering');
      }

      return removedLines.length;
    },

    _reduce: function (removedLines) {
      var newItems = this.get('newItems'),
        items = this.get('items'),
        hight = this.get('hight'),
        counter = 0;

      removedLines.sort();
      removedLines.reverse();

      //remove items related to the reduced lines from the pile
      for (var i = 0; i < removedLines.length; i++) {
        var k = removedLines[i];

        for (var j = 0; j < items[k].length; j++) {
          items[k][j] = null;
        }
      }

      // reduce the pile starting from the bottom-most line up to the top 
      for (var i = removedLines[0]; i >= hight; i--) {
        while ((counter < removedLines.length) && (i - counter == removedLines[counter])) {
          ++counter;
        }

        for (var j = 0; j < items[i].length; j++) {
          var newItem = null,
            upperItem = ((i - counter) >= 0) ? items[i - counter][j] : null;

          if (upperItem) {
            newItem = utils.contains({
              idx: { x: j, y: i },
              color: upperItem.color,
              id: upperItem.id,
            }, requiredItemFields);
          }

          items[i][j] = newItem;
        }
      }

      this.set('hight', hight + removedLines.length);
    }
  });
});
