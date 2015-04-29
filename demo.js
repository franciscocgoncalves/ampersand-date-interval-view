/*global console, window*/
// can be run with `npm run demo`
var DateView = require('./ampersand-date-interval-view');
var FormView = require('ampersand-form-view');
var pikadayCSS = require('./pikaday.css');

var input = new DateView({
		name: 'event',
		label: 'event',

		initialDate: new Date(),
		initialMinDate: new Date('Mon Jan 1 1990 00:00:00 GMT+0100 (GMT)'),
		initialMaxDate: new Date('Mon Jan 1 2020 00:00:00 GMT+0100 (GMT)'),

		//finalDate: new Date('Mon Jan 1 2016 00:00:00 GMT+0100 (GMT)'),
		finalMinDate: new Date('Mon Jan 1 1990 00:00:00 GMT+0100 (GMT)'),
		finalMaxDate: new Date('Mon Jan 1 2020 00:00:00 GMT+0100 (GMT)'),

		showTime: true,
		showSeconds: false,
		use24hour: true,
	
		intervalValue: true //tem de ser ao contrario
});


var form = document.createElement('form');
form.innerHTML = '<div data-hook="field-container"></div><input type="submit">';

var formView = new FormView({
    el: form,
    fields: [input],
    submitCallback: function (vals) {
        console.log(vals);
    }
});

window.formView = formView;

document.body.appendChild(formView.el);
