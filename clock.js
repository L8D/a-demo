'use strict';

/**
 * Precise clock
 * @module clock
 */

/**
 * This is the type for clock listener functions
 * @callback clockListener
 * @param {Clock} origin
 */

/**
 * This is the class for the clock object, the single export
 * of the module. Usually, there should be one and only one
 * shared instance of this object at a time.
 * @param {number} tickInterval - tick interval in miliseconds (used by `tick`)
 * @param {number} realInterval - tick interval in miliseconds (used by `setInterval`)
 * @property {number} interval - tick interval in miliseconds
 * @property {number} timeoutId - timeoutId from the last `setInterval` call
 * @property {number} lastTick - timestamp of the last `tick` call
 * @property {clockListener[]} listeners - array of listener callbacks
 * @class
 */
var Clock = module.exports = function(tickInterval, realInterval) {
  this.tickInterval = tickInterval;
  this.realInterval = realInterval;
  this.timeoutId = null;
  this.lastTick = null;
  this.elapsedTime = null;
  this.listeners = [];
};

Clock.prototype = {
  /**
   * Starts the clock.
   */
  start: function() {
    this.lastTick = Date.now();

    var self = this;
    this.timeoutId = setInterval(function() {
      self.tick();
    }, this.realInterval);
  },

  /**
   * When this is called, `Date.now()` and `lastTick` are
   * compared to calculate the number of ticks since the
   * last call, then all the appropriate events are fired
   * and finally `lastTick` is updated.
   *
   * This will be called at each interval if the clock has
   * been started.
   */
  tick: function() {
    var now = Date.now();
    var then = this.lastTick;
    var interval = this.tickInterval;

    var elapsed = now - then;
    var extra = elapsed % interval;
    var ticks = Math.floor(elapsed / interval);

    for (var i = 0; i < ticks; i++) {
      this.emit();
    }

    // To be fixed if any code depends on a precide lastTick value
    this.lastTick = now - extra;
    this.elapsedTime += elapsed;
  },

  /**
   * Calls each listener callback.
   */
  emit: function() {
    var listeners = this.listeners;

    for (var i = 0; i < listeners.length; i++) {
      listeners[i](this);
    }
  },

  /**
   * Adds a listener to be called for each tick.
   */
  subscribe: function(listener) {
    this.listeners.push(listener);
  },

  /**
   * Removes a previously-added listener.
   */
  unsubscribe: function(listener) {
    var listeners = this.listeners;

    var index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
};
