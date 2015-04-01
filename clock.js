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
 * @param {number} totalTicks - tick count to stop at
 * @property {number} timeoutId - timeoutId from the last `setInterval` call
 * @property {number} lastTick - timestamp of the last `tick` call
 * @property {number} elapsedTime - elapsed time in miliseconds since start
 * @property {number} elapsedTicks - number of elapsed ticks
 * @property {clockListener[]} tickListeners - array of listener callbacks
 * @property {clockListener[]} updateListeners - array of listener callbacks
 * @class
 */
var Clock = module.exports = function(tickInterval, realInterval, totalTicks) {
  this.tickInterval = tickInterval;
  this.realInterval = realInterval;
  this.totalTicks = totalTicks == null ? Infinity : totalTicks;
  this.timeoutId = null;
  this.lastTick = null;
  this.elapsedTime = null;
  this.elapsedTicks = 0;
  this.extra = 0;
  this.tickListeners = [];
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
    var total = this.totalTicks;
    var count = this.elapsedTicks;
    var interval = this.tickInterval;
    var extra = this.extra;

    var elapsed = extra + (now - then);
    extra = elapsed % interval;
    var ticks = Math.floor(elapsed / interval);

    this.lastTick = now;
    this.elapsedTime += now - then;
    this.extra = extra;
    this.elapsedTicks += ticks;

    if (ticks + count >= total) {
      ticks = total - count;
    }

    for (var i = 0; i < ticks; i++) {
      this.emitTick();
    }

    this.emitUpdate();

    if (ticks + count >= total) {
      this.stop();
    }
  },

  /**
   * Calls each tick listener callback.
   */
  emitTick: function() {
    var listeners = this.tickListeners;

    for (var i = 0; i < listeners.length; i++) {
      listeners[i](this);
    }
  },

  /**
   * Adds a listener to be called for each tick.
   */
  onTick: function(listener) {
    this.tickListeners.push(listener);
  },

  /**
   * Removes a previously-added tick listener.
   */
  offTick: function(listener) {
    var listeners = this.tickListeners;

    var index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }
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
  }
};
