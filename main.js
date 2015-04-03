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
  clock = new Clock(10);

  var knob = Knob({
    width: 200,
    min: 0,
    value: 0,
    label: format(0),
    max: time,
    fgThickness: 0.03,
    bgThickness: 0.24,
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
      clock.stop();
    } else {
      knob.draw(elapsed - time);
    }
  });

  clock.start();
}

function format(elapsed) {
  return dateFormat(new Date(elapsed), 'MM:ss');
}
