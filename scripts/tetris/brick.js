define(['point'], function (Point) {
  var side = 30;

  return Point.extend({
    top: function (center) {
      var result = {
        x: this.constructor.side * this.get('x') - this.constructor.side / 2,
        y: this.constructor.side * this.get('y') + this.constructor.side / 2
      };

      if (center) {
        result.x += center.x;
        result.y += center.y;
      }

      return result;
    }
  }, {
    side: side,
  });
});