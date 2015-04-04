'use strict';

var Clock = require('./clock');
var Knob = require('./knob');
var dateFormat = require('dateFormat');
var $ = require('jquery');

var clock = new Clock(null);

$('#seconds').on('keydown', function(e) {
  if (e.which === 13) {
    go();
  }
});

$('#start').click(function() {
  if (!clock.isRunning() && clock.elapsedTime === 0) {
    go();
  } else {
    reset();
  }
});

$('#stop').click(stop);

function stop() {
  if (clock.isRunning()) {
    clock.stop();
    $('#stop').html('Resume');
  } else {
    resume();
  }
}

function resume() {
  clock.start();
  $('#stop').html('Stop');
}

function reset() {
  clock.reset();
  $('#start').html('Start');
  $('#stop').html('Stop');
  $('#stop').addClass('pure-button-disabled');
  $('#stop').prop('disabled', true);
  makeKnob(1, 1);
}

function go() {
  if ($('#seconds').val().trim() === '') {
    return;
  }

  clock.stop();
  var seconds = +$('#seconds').val();
  start(seconds * 1000);
}

function start(time) {
  clock.stop();
  clock = new Clock(10);

  var knob = makeKnob(time, 0);

  clock.onUpdate(function() {
    var elapsed = clock.elapsedTime;

    knob.label(format(time - elapsed + 1000));

    if (elapsed >= time) {
      reset();
    } else {
      knob.draw(elapsed - time);
    }
  });

  clock.start();

  $('#start').html('Reset');
  $('#stop').removeClass('pure-button-disabled');
  $('#stop').prop('disabled', null);
}

function format(elapsed) {
  return dateFormat(new Date(elapsed), 'MM:ss');
}

function makeKnob(time, value) {
  var knob = Knob({
    width: 200,
    min: 0,
    value: value,
    label: format(0),
    max: time,
    fgThickness: 0.03,
    bgThickness: 0.24,
    fgColor: '#77A78D',
    bgColor: '#EDEDED',
    fontColor: '#4D4E5E',
    font: function() {
      return '300 34px Muli';
    }
  });

  $('#box').html(knob.element);

  return knob;
}
