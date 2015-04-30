var FormView = require('ampersand-form-view');
var View = require('ampersand-view');
var CheckboxView = require('ampersand-checkbox-view');
var PikadayView = require('ampersand-pikaday-view');

module.exports = View.extend ({
	template: [
		'<div class="form-group"><label data-hook="label"></label>',
			'<div data-hook="form-container">',
				'<div id="initial" class="date-controls"></div>',
				'<div id="interval" class="date-controls"></div>',
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
		'validityClass': {
      type: 'class',
      selector: 'input, textarea'
    },
	},
		
	initialize: function (spec) {
		spec || (spec = {});
		this.tests = this.tests || spec.tests || [];
		
		this.initialValue =  spec.initialDate || this.initialValue;
		this.finalValue = spec.finalDate || this.finalValueDate;
		
		this.value = {
			initialDate: this.initialValue,
			finalDate: this.finalValue
		};
		
		this.startingValue = this.value;
		
		if (spec.template) this.template = spec.template;

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
			fields: [this.finalDatePicker],
		});
		
		if(self.intervalOptional) {
			this.interval = this.query('#interval');

			this.intervalCheckbox = new CheckboxView({
				name: 'interval',
				label: 'With interval',
				value: false,
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
		value: 'any',
		startingValue: 'any',
				
		name: 'string',
		label: ['string', false, ''],

		validClass: ['string', true, 'input-valid'],
    invalidClass: ['string', true, 'input-invalid'],
   	rootElementClass: ['string', true, ''],		
		
		initialValue: ['date', false, Date.now()],
		initialMinDate: ['date', false, Date('01 January, 1970 UTC')],
		initialMaxDate: ['date', false, Date('01 January, 2070 UTC')],
		initialDatePicker: 'any',
		
		finalValue: ['date', false],
		finalMinDate: ['date', false, Date('01 January, 1970 UTC')],
		finalMaxDate: ['date', false, Date('01 January, 2070 UTC')],
		finalDatePicker: 'any',
		
		showTime: ['boolean', false, true],
		showSeconds: ['boolean', false, false],
		use24hour: ['boolean', false, false],
		
		intervalOptional: ['boolean', false, false],
		intervalCheckbox: 'any'
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

    validityClass: {
      deps: ['valid', 'validClass', 'invalidClass', 'shouldValidate'],
      fn: function () {
        if (!this.shouldValidate) {
          return '';
        } 
				else {
        	return this.valid ? this.validClass : this.invalidClass;
				}
    	}
    },
		
		initialDatePickerValid: {
			deps:['initialDatePicker'],
			cache: false,
			fn: function() {
				if (this.initialDatePicker && this.initialDatePicker !== null) {
					return this.initialDatePicker.valid;
				}
			}
		},
		
		finalDatePickerValid: {
			deps:['finalDatePicker'],
			cache: false,
			fn: function() {
				if (this.finalDatePicker && this.finalDatePicker !== null) {
					return this.finalDatePicker.valid;
				}
			}
		},
		
		intervalCheckboxValue: {
			deps:['intervalCheckbox', 'finalDatePickerValid'],
			cache: false,
			fn: function() {
				if (this.intervalCheckbox && this.intervalCheckbox !== null) {
					this.finalDatePicker.required = this.intervalCheckbox.value;
					return this.intervalCheckbox.value;
				}
				return null;
			}
		},
		
		valid: {
			deps:['value', 'intervalCheckboxValue', 'initialDatePickerValid', 'finalDatePickerValid'],
			cache: false,
			fn: function() {	
				if (this.intervalCheckboxValue !== null && !this.intervalCheckboxValue) {
					this.value.finalDate = null;
					
					if(this.initialDatePickerValid) {
						return this.initialDatePickerValid;	
					}
				}
				else {
					if (this.initialDatePickerValid && this.finalDatePickerValid) {
						return this.initialDatePicker.value < this.finalDatePicker.value;
					}
				}
				return false;
			}
		}
	},
	
	required: function () {
		var self = this;
		
		if(!self.intervalOptional) return true;
		if(self.intervalCheckbox && self.intervalCheckbox !== null) {
			return self.intervalCheckbox.value;
		}
		return false;
	},
	
	setValue: function (value, skipValidation) {
		this.value = value;
	},

	reset: function () {
		this.setValue(this.startingValue);
	},

	clear: function () {
		this.setValue();
	}
});