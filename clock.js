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
 * @param {number} interval - interval in miliseconds (used by `setInterval`)
 * @property {number} timeoutId - timeoutId from the last `setInterval` call
 * @property {number} elapsedTime - elapsed time in miliseconds since start
 * @property {clockListener[]} updateListeners - array of listener callbacks
 * @class
 */
var Clock = module.exports = function(interval) {
  this.interval = interval;
  this.timeoutId = null;
  this.lastTick = null;
  this.elapsedTime = 0;
  this.updateListeners = [];
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

    this.elapsedTime += now - then;
    this.lastTick = now;
    this.emitUpdate();
  },

  /**
   * Calls each tick listener callback.
   */
  emitUpdate: function() {
    var listeners = this.updateListeners;

    for (var i = 0; i < listeners.length; i++) {
      listeners[i](this);
    }
  },

  /**
   * Adds a listener to be called for each update.
   */
  onUpdate: function(listener) {
    this.updateListeners.push(listener);
  },

  /**
   * Removes a previously-added update listener.
   */
  offUpdate: function(listener) {
    var listeners = this.updateListeners;

    var index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  },

  stop: function() {
    clearInterval(this.timeoutId);
    this.timeoutId = null;
  },

  isRunning: function() {
    return this.timeoutId != null;
  }
};
