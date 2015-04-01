'use strict';

var $ = require('jquery');

module.exports = function(options) {
  var value = options.value;
  var label = options.label || String(options.value);

  var min = options.min == null ? 0 : options.min;
  var max = options.max == null ? 100 : options.max;

  var thickness = options.thickness || 0.35;
  var lineCap = options.lineCap || 'butt';

  var width = options.width || 200;
  var height = options.height || width;
  var center = width / 2;

  var bgColor = options.bgColor || '#EEEEEE';
  var fgColor = options.fgColor || '#87CEEB';

  var angleOffset = options.angleOffset == null ? 0 : options.angleOffset;
  var angleArc = options.angleArc == null ? 360 : options.angleArc;

  // deg to rad
  angleOffset = angleOffset * Math.PI / 180;
  angleArc = angleArc * Math.PI / 180;

  var fontScale = Math.max(
    String(Math.abs(max)).length,
    String(Math.abs(min)).length,
    2
  ) + 2;

  var lineWidth = center * thickness;

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

    var radius = center - lineWidth / 2;

    var startAngle = 1.5 * Math.PI + angleOffset;
    var endAngle = 1.5 * Math.PI + angleOffset + angleArc;

    ctx.beginPath();
    ctx.strokeStyle = bgColor;
    ctx.arc(center, center, radius, endAngle, startAngle, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = fgColor;
    ctx.arc(center, center, radius, startAngle, startAngle + angle, false);
    ctx.stroke();
  }

  function makeCanvas() {
    var canvas = $('<canvas>');

    // TIL
    canvas.attr('width', width);
    canvas.attr('height', height);
    canvas.css({position: 'absolute'});

    return canvas;
  }

  function makeContext(canvas) {
    var ctx = canvas.get(0).getContext('2d');

    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;

    return ctx;
  }

  function makeInput() {
    var input = $('<input>', {value: label});

    input.css({
      position: 'absolute',
      top: center - (width / 7),
      left: lineWidth,
      width: width - (lineWidth * 2),
      'vertical-align' : 'middle',
      border: 0,
      background : 'none',
      font: 'bold ' + ((width / fontScale) >> 0) + 'px Arial',
      'text-align' : 'center',
      color: fgColor,
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
      height: height,
      width: width
    });

    return element;
  }
};
