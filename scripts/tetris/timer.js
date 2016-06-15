define(['can'], function () {
  return can.Construct.extend({
    defaults: function() {}
  }, {
    init: function (onTick) {
      this._winInterval = undefined;
      this.ms = 500;

      if (onTick) {
        this.onTick = onTick;
      }
    },

    on: function (event, handler) {
      this._events[event] = handler;
    },

    start: function () {
      var self = this;

      this.stop();

      this._winInterval = setInterval(function () {
        if (self.onTick) {
          self.onTick();
        }
      }, this.ms);

      return this;
    },

    stop: function () {
      if (this._winInterval) {
        window.clearInterval(this._winInterval);
      }

      return this;
    },

    restart: function () {
      this.stop();
      this.start();
    }
  });
});
