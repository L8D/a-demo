'use strict';

var Clock = require('./clock');
var Knob = require('./knob');
var dateFormat = require('dateFormat');
var $ = require('jquery');

var clock = {stop: function() {}};

$('#time-form').submit(function(e) {
  e.preventDefault();

  var seconds = +$('#time-val').val();

  start(seconds);
});

function start(time) {
  clock.stop();
  clock = new Clock(1000, 10, time);

  var knob = Knob({
    width: 150,
    min: 0,
    value: 0,
    label: format(0),
    max: time * 1000,
    thickness: 0.2,
    fgColor: '#eee',
    bgColor: '#87ceeb'
  });

  $('#box').html(knob.element);

  clock.onUpdate(function() {
    knob.label(format(time * 1000 - clock.elapsedTime + 1000));
    knob.draw(clock.elapsedTime);
  });

  clock.start();
}

function format(elapsed) {
  return dateFormat(new Date(elapsed), 'MM:ss');
}
