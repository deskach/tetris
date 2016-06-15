define(['brick'], function (Brick) {
  return Brick.extend({}, {
    side: Math.floor(Brick.side / 2),
  });
});