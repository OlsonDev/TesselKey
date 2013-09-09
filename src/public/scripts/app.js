/*jshint devel: true, browser: true, white: false, forin: true, plusplus: true, maxerr: 1000, indent: 2, jquery: true */
/*global _ */
(function() {
	'use strict';
	var vm = {
			board: {
				name: 'Tessel'
				, switches: buildSwitches()
				, leds: buildLEDs()
				, pins: []
				, pinGroups: buildPinGroups()
			}
		}
		, mapping = {
			switches: { create: function(o) { return new Switch(o.data, o.parent); } }
			, leds: { create: function(o) { return new LED(o.data, o.parent); } }
			, pins: { create: function(o) { return new Pin(o.data, o.parent); } }
			, pinGroups: { create: function(o) { return new PinGroup(o.data, o.parent); } }
			, board: { create: function(o) { return new Board(o.data, o.parent); } }
		}
	;

	function buildSwitches() {
		return _.map('Reset|Smart Config'.split('|'), function(desc, i) {
			var name = 'S' + (i + 1);
			return { name: name, description: desc || name };
		});
	}

	function buildLEDs() {
		return _.map('|Conn|Error|LED 1|LED 2'.split('|'), function(desc, i) {
			var name = 'D' + (i + 1);
			return { name: name, description: desc || name };
		});
	}

	function buildPinGroups() {
		var groups = _.map('ABCDE', function(name) {
				return { name: name, description: name, pins: buildDefaultPins() };
			})
			, e = groups[groups.length - 1]
			, ep = e.pins
		;
		ep.push.apply(ep, buildGPIOPins());
		return groups;
	}

	function buildDefaultPins() {
		return _.map('GND|3V3|SCL|SDA|CLK|MISO|MOSI|G1|G2|G3'.split('|'), function(name, i) {
			return { name: name, description: name };
		});
	}

	function buildGPIOPins() {
		return _.map('G6|G5|G4|A5|A4|A3|A2|A1|A0|5V'.split('|'), function(name, i) {
			return { name: name, description: name };
		});
	}

	function init(data, parent) {
		var self = this;
		_.extend(self, ko.mapping.fromJS(data, mapping));
		self.ctor = ko.computed(function() {
			return _.objectTypeName(self);
		});
		self.cssClass = ko.computed(function() {
			var name = _.isFunction(self.name) ? '-' + _.classify(self.name()) : '';
			return _.classify(self.ctor()) + name;
		});
		self.hovered = ko.observable(false);
	}

	function Switch() {
		var self = this;
		init.apply(self, arguments);
	}

	function LED() {
		var self = this;
		init.apply(self, arguments);
	}

	function Pin() {
		var self = this;
		init.apply(self, arguments);
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
		self.scale = ko.observable(0.4);
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
	}

	window.vm = vm = new ViewModel(vm);

	$(function() {
		ko.applyBindings(vm);
	});
}());