define(['shape', 'bricks', 'point'], function (Shape, Bricks, Point) {
  var shapeTypes = {
    Square: 'square',
    L: 'L',
    T: 'T',
    Stick: 'stick',
    zigUp: 'zigUp',
    zigDown: 'zigDown'
  };
  var shapeTypeTest = 'test';

  var shapeColors = {};
  shapeColors[shapeTypes.Square] = '#0000FF';
  shapeColors[shapeTypes.L] = '#229933';
  shapeColors[shapeTypes.T] = '#C47929';
  shapeColors[shapeTypes.Stick] = '#FF0000';
  shapeColors[shapeTypes.zigUp] = '#aa22cc';
  shapeColors[shapeTypes.zigDown] = '#33eeff';

  var creators = {};

  // ##
  // ##
  creators[shapeTypes.Square] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 1, y: 0 }),
      new ShapeBrick({ x: 0, y: 1 }),
      new ShapeBrick({ x: 1, y: 1 })
    ]);
  };

  //   #
  // #C#
  creators[shapeTypes.L] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: 1, y: -1 }),
      new ShapeBrick({ x: -1, y: 0 }),
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 1, y: 0 })
    ]);
  };

  //  #
  // #C#
  creators[shapeTypes.T] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: 0, y: -1 }),
      new ShapeBrick({ x: -1, y: 0 }),
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 1, y: 0 })
    ]);
  };

  // ##C##
  creators[shapeTypes.Stick] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: -2, y: 0 }),
      new ShapeBrick({ x: -1, y: 0 }),
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 1, y: 0 }),
      new ShapeBrick({ x: 2, y: 0 })
    ]);
  };

  // #C
  //  ##
  creators[shapeTypes.zigDown] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: -1, y: 0 }),
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 0, y: 1 }),
      new ShapeBrick({ x: 1, y: 1 })
    ]);
  };

  //  C#
  // ##
  creators[shapeTypes.zigUp] = function (ShapeBrick) {
    return new Bricks([
      new ShapeBrick({ x: 0, y: 0 }),
      new ShapeBrick({ x: 1, y: 0 }),
      new ShapeBrick({ x: -1, y: 1 }),
      new ShapeBrick({ x: 0, y: 1 })
    ]);
  };

  // #
  creators[shapeTypeTest] = function () {
    return new Bricks([
      new ShapeBrick({ x: 0, y: 0 })     // #
    ]);
  };

  function _createShape(shapeType, ShapeBrick, cX, cY, pile) {
    function createBricks4(name, Brick) {
      var bricks = (creators.hasOwnProperty(name)) ? creators[name](ShapeBrick) : null;

      return bricks;
    }

    var bricks = createBricks4(shapeType);
    var color = shapeType in shapeColors ? shapeColors[shapeType] : '#888888';
    var shape = new Shape({
      bricks: bricks,
      color: color,
      center: { x: cX, y: cY },
      type: shapeType
    });

    shape['pile'] = pile;

    var minY = shape.min('y');
    if (minY < 0) {
      shape.get('center').y += Math.abs(minY);
    }

    return shape;
  }

  function _createRandomShapeType() {
    var factoryShapeTypes = Object.keys(shapeFactory.shapeType);
    var i = _.random(0, factoryShapeTypes.length - 1);
    var randomShapeType = shapeFactory.shapeType[factoryShapeTypes[i]];

    return randomShapeType;
  }

  var shapeFactory = {
    shapeType: shapeTypes,
    shapeColor: shapeColors,

    createShape: _createShape,
    createRandomShapeType: _createRandomShapeType
  };

  return shapeFactory;
});
