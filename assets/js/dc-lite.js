/*
 * Olm Lab website: page behavior runtime (no dependencies).
 *
 * The moving parts of each page (the logo morph, the pause/play buttons, the Home slideshow and
 * the seasonal banner photos) are described by a small Component class in assets/js/pages/.
 * This file runs that class and keeps the page in step with it. The page markup says what to update:
 *
 *   data-dc-attr-NAME="... {{value}} ..."  attribute NAME is filled in from the component's values
 *   data-dc-if="value"                     the element is shown only while that value is true
 *   data-dc-on="click:handler ..."         DOM events call the component's handlers
 *   data-dc-js                             a control that needs JavaScript; hidden until this runs
 *
 * The HTML is complete without JavaScript; this only adds the motion and the buttons.
 */
(function () {
  'use strict';

  var component = null;
  var vals = {};
  var queued = false;
  var HOLE = /\{\{\s*([\w.]+)\s*\}\}/g;

  class DCLogic {
    constructor(props) {
      this.props = props || {};
    }
    setState(patch) {
      var next = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, next);
      schedule();
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    Promise.resolve().then(function () {
      queued = false;
      render();
    });
  }

  function fill(template) {
    return template.replace(HOLE, function (_, name) {
      var v = vals[name];
      return v === undefined || v === null ? '' : String(v);
    });
  }

  function render() {
    if (!component) return;
    vals = component.renderVals() || {};

    var bound = document.querySelectorAll('[data-dc-bind]');
    for (var i = 0; i < bound.length; i++) {
      var el = bound[i];
      var attrs = Array.prototype.slice.call(el.attributes);
      for (var j = 0; j < attrs.length; j++) {
        if (attrs[j].name.indexOf('data-dc-attr-') !== 0) continue;
        var target = attrs[j].name.slice('data-dc-attr-'.length);
        var value = fill(attrs[j].value).trim();
        if (el.getAttribute(target) !== value) el.setAttribute(target, value);
      }
    }

    var conditional = document.querySelectorAll('[data-dc-if]');
    for (var k = 0; k < conditional.length; k++) {
      var c = conditional[k];
      var show = !!vals[c.getAttribute('data-dc-if')];
      if (show && c.hasAttribute('hidden')) c.removeAttribute('hidden');
      else if (!show && !c.hasAttribute('hidden')) c.setAttribute('hidden', '');
    }
  }

  function bindEvents() {
    var els = document.querySelectorAll('[data-dc-on]');
    Array.prototype.forEach.call(els, function (el) {
      el.getAttribute('data-dc-on').trim().split(/\s+/).forEach(function (pair) {
        var at = pair.indexOf(':');
        var type = pair.slice(0, at);
        var handler = pair.slice(at + 1);
        el.addEventListener(type, function (event) {
          var fn = vals[handler];
          if (typeof fn === 'function') fn(event);
        });
      });
    });
  }

  function start(Component, props) {
    component = new Component(props || {});
    render();
    bindEvents();
    var jsOnly = document.querySelectorAll('[data-dc-js]');
    for (var i = 0; i < jsOnly.length; i++) jsOnly[i].removeAttribute('hidden');
    if (typeof component.componentDidMount === 'function') component.componentDidMount();
  }

  window.DCLogic = DCLogic;
  // Called at the end of each page's script in assets/js/pages/.
  window.DCBoot = function (Component, props) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { start(Component, props); });
    } else {
      start(Component, props);
    }
  };
})();
