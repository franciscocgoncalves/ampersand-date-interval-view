var FormView = require('ampersand-form-view');
var View = require('ampersand-view');
var CheckboxView = require('ampersand-checkbox-view');
var PikadayView = require('ampersand-pikaday-view');

module.exports = View.extend ({
	template: [
		'<div class="form-group"><label data-hook="label"></label>',
			'<div data-hook="form-container">',
				'<div id="interval" class="date-controls"></div>',
				'<div id="initial" class="date-controls"></div>',
				'<div id="final" class="date-controls"></div>',
			'</div>',
		  '<div data-hook="message-container">',
      	'<div data-hook="message-text" class="alert alert-danger"></div>',
      '</div>',
		'</div>'
		
	].join(''),
		
	bindings: {
		'initialDate': {
			hook: 'initialDate',
			type: 'attribute',
			name: 'initialDate'
		},
		'finalDate': {
			hook: 'finalDate',
			type: 'attribute',
			name: 'finalDate'
		},
		'interval': {
			hook: 'interval',
			type: 'attribute',
			name: 'interval'
		},
		'label': [
			{
				hook: 'label'
			},
			{
				type: 'toggle',
				hook: 'label' 
			}
		],
		'message': {
					type: 'text',
					hook: 'message-text'
			},
		'showMessage': {
			type: 'toggle',
			hook: 'message-container'
		},
	},
		
	initialize: function (spec) {
		spec || (spec = {});
		this.tests = this.tests || spec.tests || [];
		if (spec.template) this.template = spec.template;

		// will probably want this more selective, but for now, always validate
		this.shouldValidate = true;
	},
		
	render: function () {
		var self = this;

		//call the parent first
		View.prototype.render.apply(this);
		this.initialDate = this.query('#initial');

		this.initialDatePicker = new PikadayView({
			value: self.initialValue,
			required: true,
			minDate: self.initialMinDate,
			maxDate: self.initialMaxDate,
			showTime: self.showTime,
			showSeconds: self.showSeconds,
			use24hour: self.use24hour
		});

		var initialFormView = new FormView({
			el: this.initialDate,
			fields: [this.initialDatePicker]
		});
		
		this.finalDate = this.query('#final');

		this.finalDatePicker = new PikadayView({
			value: self.finalValueDate,
			required: self.required(),
			minDate: self.finalMinDate,
			maxDate: self.finalMaxDate,
			showTime: self.showTime,
			showSeconds: self.showSeconds,
			use24hour: self.use24hour
		});
		
		var finalFormView = new FormView({
			el: this.finalDate,
			fields: [this.finalDatePicker]
		});
		
		if(self.intervalValue) {
			this.interval = this.query('#interval');

			this.intervalCheckbox = new CheckboxView({
				name: 'interval',
				label: 'With interval',
				value: self.intervalValue || false,
				required: false,
				validClass: 'input-valid',
				invalidClass: 'input-invalid',
				requiredMessage: 'This box must be checked.'
			});

			var intervalFormView = new FormView({
				el: this.interval,
				fields: [this.intervalCheckbox]
			});
		}
	},
		
	props: {
		name: 'string',
		label: ['string', false, ''],

		initialValue: ['date', false, Date.now()],
		initialMinDate: ['date', false, Date('01 January, 1970 UTC')],
		initialMaxDate: ['date', false, Date('01 January, 2070 UTC')],

		finalValue: ['date', false],
		finalMinDate: ['date', false, Date('01 January, 1970 UTC')],
		finalMaxDate: ['date', false, Date('01 January, 2070 UTC')],

		showTime: ['boolean', false, true],
		showSeconds: ['boolean', false, false],
		use24hour: ['boolean', false, false],
		
		intervalValue: ['boolean', false, false]
	},
	
	derived: {
		finalValueDate: {
			deps:['initialValue', 'finalValue'],
			fn: function () {
				if (this.finalValue !== undefined) {
					return this.finalValue;
				}
				var date = new Date(this.initialValue);
		
				date.setHours(this.initialValue.getHours() + 1);
				return date;
			}
		},
		
	  showMessage: {
			deps: ['message', 'shouldValidate'],
      fn: function () {
        return this.shouldValidate && this.message;
      }
    },
	},
	
	required: function () {
		var self = this;

		if(!self.intervalValue) return true;
		if(self.intervalCheckbox) {
			return self.intervalCheckbox.value;
		}
		return false;
	}
});