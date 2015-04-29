var test = require('tape');
var DateIntervalView = require('../ampersand-date-interval-view');

if (!Function.prototype.bind) Function.prototype.bind = require('function-bind');

test('basic initialization', function (t) {
    var control = new DateIntervalView({ name: 'title' });
    control.render();
    t.equal(control.el.tagName, 'DIV');
    t.equal(control.el.querySelectorAll('input').length, 1);
    t.equal(control.el.querySelector('input').getAttribute('name'), 'title');
    t.end();
});