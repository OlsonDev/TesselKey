/*jshint devel: true, browser: true, white: false, forin: true, plusplus: true, maxerr: 1000, indent: 2, jquery: true */
/*global _ */
(function() {
	'use strict';
	var vm = {
			board: {
				name: 'Tessel'
				, chips: buildChips()
				, switches: buildSwitches()
				, leds: buildLEDs()
				, pinGroups: buildPinGroups()
			}
		}
		, mapping = {
			  chips:     { create: function(o) { return new Chip    (o.data, o.parent); } }
			, switches:  { create: function(o) { return new Switch  (o.data, o.parent); } }
			, leds:      { create: function(o) { return new LED     (o.data, o.parent); } }
			, pins:      { create: function(o) { return new Pin     (o.data, o.parent); } }
			, pinGroups: { create: function(o) { return new PinGroup(o.data, o.parent); } }
			, board:     { create: function(o) { return new Board   (o.data, o.parent); } }
		}
	;

	function buildChips() {
		return _.map('Microcontroller|Flash|RAM|Wi-Fi'.split('|'), function(name, i) {
			return { name: name, description: name };
		});
	}

	function buildSwitches() {
		return _.map('Reset button|SimpleLink Wi-Fi SmartConfig button'.split('|'), function(desc, i) {
			var name = 'S' + (i + 1);
			return { name: name, description: desc || name };
		});
	}

	function buildLEDs() {
		return _.map('Power LED|Wi-Fi Connection LED|Wi-Fi Error LED|Debug LED 1|Debug LED 2'.split('|'), function(desc, i) {
			var name = 'D' + (i + 1);
			return { name: name, description: desc || name };
		});
	}

	function buildPinGroups() {
		var groups = _.map('GPIO Bank|A|B|C|D'.split('|'), function(name, i) {
				var inches = i ? '0.1' : '0.2'
					, mm = i ? '2.54' : '5.08'
					, pinNumFactor = !i * 2
					, pinNumOffset = !i * -1
				;
				return {
					name: name
					, description: name.length === 1 ? 'Module ' + name : name
					, numPins: name.length === 1 ? '10 pins (1x10)' : '20 pins (2x10)'
					, pins: buildDefaultPins(inches, mm, pinNumFactor, pinNumOffset)
				};
			})
			, gpio = groups[0]
		;
		gpio.pins = buildGPIOPins().concat(gpio.pins);
		return groups;
	}

	function buildPins(names, inches, mm, pinNumFactor, pinNumOffset) {
		pinNumFactor = pinNumFactor || 1;
		pinNumOffset = pinNumOffset || 0;
		return _.map(names.split('|'), function(name, i) {
			return {
				name: name
				, description: name
					.replace(/^A(\d)$/, 'ADC$1')
					.replace(/^G(\d)$/, 'GPIO$1')
				, inchesToEdge: inches || '0.1'
				, mmToEdge: mm || '2.54'
				, pinNum: (i + 1) * pinNumFactor + pinNumOffset
			};
		});
	}

	function buildDefaultPins(inches, mm, pinNumFactor, pinNumOffset) {
		return buildPins('GND|3V3|SCL|SDA|CLK|MISO|MOSI|G1|G2|G3', inches, mm, pinNumFactor, pinNumOffset);
	}

	function buildGPIOPins(inches, mm) {
		return buildPins('G6|G5|G4|A5|A4|A3|A2|A1|A0|5V', inches, mm, 2);
	}

	function init(data, parent) {
		var self = this;
		_.extend(self, ko.mapping.fromJS(data, mapping));
		self.ctor = ko.computed(function() {
			return _.objectTypeName(self);
		});
		self.typeCode = ko.computed(function() {
			return _.slugify(self.ctor());
		});
		self.code = ko.computed(function() {
			var name = _.isFunction(self.name) ? '-' + _.slugify(self.name()) : '';
			return self.typeCode() + name;
		});
		self.tooltipTmpl = ko.computed(function() { return '#' + self.code() + '-tooltip-tmpl, #' + self.typeCode() + '-tooltip-tmpl'; });
		self.tooltipTmplClass = ko.computed(function() { return self.code() + '-tooltip ' + self.typeCode() + '-tooltip'; });
		self.hovered = ko.observable(false);
	}

	function Chip() {
		var self = this;
		init.apply(self, arguments);
	}

	function Switch() {
		var self = this;
		init.apply(self, arguments);
	}

	function LED() {
		var self = this;
		init.apply(self, arguments);
	}

	function Pin(data, pinGroup) {
		var self = this;
		init.apply(self, arguments);
		self.tooltipTmpl = ko.computed(function() {
			var code = self.code()
				, pinGroupCode = 'pin-group-' + _.slugify(pinGroup.name())
			;
			return '#' + pinGroupCode + '-' + code + '-tooltip-tmpl, #' + code + '-tooltip-tmpl, #' + self.typeCode() + '-tooltip-tmpl';
		});
		self.fullName = ko.computed(function() {
			var name = self.name()
				, desc = self.description()
			;
			return name === desc ? name : name + ' (' + desc + ')';
		});
	}

	function PinGroup() {
		var self = this;
		init.apply(self, arguments);
		self.hasHoveredChild = ko.computed(function() {
			return !!self.pins.firstByProperty('hovered', true);
		});
	}

	function Board() {
		var self = this
			, w = 1977
			, h = 2360
		;
		init.apply(self, arguments);
		self.scale = ko.observable(0.24);
		self.rotation = ko.observable(0);
		self.width  = ko.computed(function() { return self.scale() * w + 'px'; });
		self.height = ko.computed(function() { return self.scale() * h + 'px'; });
		self.rotationDeg = ko.computed(function() { return self.rotation() + 'deg'; });
		self.transform = ko.computed(function() {
			return 'rotate(' + self.rotationDeg() + ')';
		});
	}

	function ViewModel() {
		var self = this;
		init.apply(self, arguments);
		self.ready = ko.observable(false);
	}

	window.vm = vm = new ViewModel(vm);

	$(function() {
		ko.applyBindings(vm);
		vm.ready(true);
	});
}());