'use strict';

var $ = require('jquery');

module.exports = function(options) {
  var value = options.value;
  var label = options.label || String(options.value);

  var font = options.font || function(size) {
    return 'bold ' + size + 'px Arial';
  };

  var min = options.min == null ? 0 : options.min;
  var max = options.max == null ? 100 : options.max;

  var fgThickness = options.fgThickness || 0.35;
  var bgThickness = options.bgThickness || fgThickness;

  var lineCap = options.lineCap || 'butt';

  var realWidth = options.width || 200;
  var width = realWidth * 4;
  var center = width / 2;

  var bgColor = options.bgColor || '#EEEEEE';
  var fgColor = options.fgColor || '#87CEEB';
  var fontColor = options.fontColor || fgColor;

  var angleOffset = options.angleOffset == null ? 0 : options.angleOffset;
  var angleArc = options.angleArc == null ? 360 : options.angleArc;

  // Deg to rad
  angleOffset = angleOffset * Math.PI / 180;
  angleArc = angleArc * Math.PI / 180;

  var fontScale = 5;

  var fgLineWidth = center * fgThickness;
  var bgLineWidth = center * bgThickness;

  var canvas = makeCanvas();
  var ctx = makeContext(canvas);
  var input = makeInput();
  var element = makeDiv();

  element.append(canvas, input);

  draw(value);

  return {element: element, draw: draw, label: setLabel};

  function setLabel(label) {
    input.val(label);
  }

  function draw(value) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var angle = (value - min) * angleArc / (max - min);

    var radius = center - bgLineWidth / 2;

    var startAngle = 1.5 * Math.PI + angleOffset;
    var endAngle = 1.5 * Math.PI + angleOffset + angleArc;

    ctx.beginPath();
    ctx.strokeStyle = bgColor;
    ctx.lineWidth = bgLineWidth;
    ctx.arc(center, center, radius, endAngle, startAngle, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = fgColor;
    ctx.lineWidth = fgLineWidth;
    ctx.arc(center, center, radius, startAngle, startAngle + angle, value !== max);
    ctx.stroke();
  }

  function makeCanvas() {
    var canvas = $('<canvas>');

    // TIL
    canvas.attr('width', width);
    canvas.attr('height', width);
    canvas.css({position: 'relative', width: realWidth, height: realWidth});

    return canvas;
  }

  function makeContext(canvas) {
    var ctx = canvas.get(0).getContext('2d');

    ctx.lineCap = lineCap;

    return ctx;
  }

  function makeInput() {
    var input = $('<input>', {value: label});

    input.css({
      position: 'absolute',
      top: (realWidth / 2) - (realWidth / 8),
      left: (realWidth / 2) * bgThickness,
      width: realWidth - (realWidth * bgThickness),
      'vertical-align': 'middle',
      border: 0,
      background: 'none',
      font: font((realWidth / fontScale) >> 0),
      'text-align': 'center',
      color: fontColor,
      padding: 0,
      '-webkit-appearance': 'none'
    });

    return input;
  }

  function makeDiv() {
    var element = $('<div>');

    element.css({
      display: 'inline-block',
      position: 'relative',
      height: realWidth,
      width: realWidth
    });

    return element;
  }
};
