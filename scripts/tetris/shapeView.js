define(['brick'], function (Brick) {
  return Backbone.View.extend({
    tagName: 'div',

    className: 'tts-shape',

    brickClass: 'tts-brick',

    initialize: function () {
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.brickClass = arguments[0]['brickClass'] || this.brickClass;

      this.model.on('render', this.render, this);
    },

    render: function () {
      var self = this;
      var center = this.model.center(this.top);
      var color = this.model.get('color');

      this.model.get('bricks').each(function (brick) {
        var t = brick.top(center);
        var $brick = $('<div></div>');
        var brickSide = self.model.get('bricks').at(0).constructor.side;

        $brick.attr('id', brick.cid);
        $brick.attr('class', self.brickClass);
        $brick.css({
          'left': t.x,
          'top': t.y,
          'width': brickSide + 'px',
          'height': brickSide + 'px',
          'background-color': color
        });

        self.$('#' + brick.cid).remove();
        self.$el.append($brick);
      });

      this.$el.attr('id', this.model.cid);

      return this;
    }
  });
});
