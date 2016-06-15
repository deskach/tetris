define(['point', 'bricks'], function (Point, Bricks) {
  var rotations = {
    clockwise: 1,
    counterClockwise: -1
  };

  var axels = {
    x: 'x',
    y: 'y'
  }

  return Backbone.Model.extend({
    defaults: {
      center: new Point(),
      bricks: new Bricks(),
      color: '#1155aa',
      type: null
    },

    rotate: function (direction) {
      this.get('bricks').each(function (brick) {
        var dx = brick.get('y');
        var dy = brick.get('x');

        (direction == rotations.clockwise) ? dx = -1 * dx : dy = -1 * dy;

        brick.set({ 'x': dx, 'y': dy });
      });
    },

    move: function (axel, val) {
      var oldVal = this.get('center')[axel];
      var newVal = oldVal + val;

      this.get('center')[axel] = newVal;
    },

    // returns absolute center in pixels relatively to the pile
    center: function (top) {
      top = top || { x: 0, y: 0 };

      var brickSide = this.get('bricks').at(0).constructor.side;
      var cX = brickSide * this.get('center').x + Math.floor(brickSide / 2) + top.x;
      var cY = brickSide * this.get('center').y - Math.floor(brickSide / 2) + top.y;

      return { x: cX, y: cY };
    },

    min: function (axel) {
      var bricks = this.get('bricks');

      var min = bricks.min(function (brick) {
        return brick.get(axel);
      }).get(axel);

      return min;
    },

    max: function (axel) {
      var bricks = this.get('bricks');

      var max = bricks.max(function (brick) {
        return brick.get(axel);
      }).get(axel);

      return max;
    }
  }, {
    rotation: rotations,
    axel: axels
  });
});
