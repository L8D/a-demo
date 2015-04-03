'use strict';

var Clock = require('./clock');
var Knob = require('./knob');
var dateFormat = require('dateFormat');
var $ = require('jquery');

var clock = new Clock(null);

$('#seconds').on('keydown', function(e) {
  if (e.which === 13) {
    go(e);
  }
});

$('#start').click(function(e) {
  if (clock.isRunning()) {
    go(e);
  } else {
    if ($('#start').html() === 'Resume') {
      clock.start();
      $('#start').html('Restart');
      $('#stop').html('Stop');
    } else {
      go(e);
    }
  }
});

$('#stop').click(stop);

function stop() {
  if (clock.isRunning()) {
    clock.stop();
    $('#stop').html('Reset');
    $('#start').html('Resume');
  } else {
    reset();
  }
};

function reset() {
  clock.reset();
  $('#start').html('Start');
  $('#stop').html('Stop');
  $('#stop').addClass('pure-button-disabled');
  $('#stop').prop('disabled', true);
  makeKnob(0);
}

function go(e) {
  if ($('#seconds').val().trim() === '') {
    return;
  }

  e.preventDefault();

  clock.stop();
  var seconds = +$('#seconds').val();
  start(seconds * 1000);
}

function start(time) {
  clock.stop();
  clock = new Clock(10);

  var knob = makeKnob(time);

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

  $('#start').html('Restart');
  $('#stop').removeClass('pure-button-disabled');
  $('#stop').prop('disabled', null);
}

function format(elapsed) {
  return dateFormat(new Date(elapsed), 'MM:ss');
}

function makeKnob(time) {
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

  return knob;
}
