'use strict';

var Clock = require('./clock');
var Knob = require('./knob');
var dateFormat = require('dateFormat');
var $ = require('jquery');

var clock = {stop: function() {}};

$('#time-form').submit(function(e) {
  e.preventDefault();

  var seconds = +$('#time-val').val();

  start(seconds * 1000);
});

function start(time) {
  clock.stop();
  clock = new Clock(1000, 10, time / 1000);

  var knob = Knob({
    width: 150,
    min: 0,
    value: 0,
    label: format(0),
    max: time,
    fgThickness: 0.05,
    bgThickness: 0.2,
    fgColor: '#77A78D',
    bgColor: '#EDEDED',
    fontColor: '#4D4E5E',
  });

  $('#box').html(knob.element);

  clock.onUpdate(function() {
    var elapsed = clock.elapsedTime;

    knob.label(format(time - elapsed + 990));

    if (elapsed >= time) {
      knob.draw(0);
    } else {
      knob.draw(elapsed - time);
    }
  });

  clock.start();
}

function format(elapsed) {
  return dateFormat(new Date(elapsed), 'MM:ss');
}
