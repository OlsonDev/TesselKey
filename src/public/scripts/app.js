/*jshint devel: true, browser: true, white: false, forin: true, plusplus: true, maxerr: 1000, indent: 2, jquery: true */
/*global _ */
(function() {
	'use strict';
	var vm = {}
		, mapping = {
			  layouts:  { create: function(o) { return new Layout (o.data, o.parent); } }
			, profiles: { create: function(o) { return new Profile(o.data, o.parent); } }
		}
	;

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

	function Layout() {
		var self = this;
		init.apply(self, arguments);
		self.numRows = ko.observable(10);
		self.numColumns = ko.observable(10);
		self.keys = ko.observableArray();
	}

	function LayoutKey() {
		var self = this;
		init.apply(self, arguments);
		self.row = ko.observable(0);
		self.column = ko.observable(0);
	}

	function USBKey() {
		var self = this;
		init.apply(self, arguments);
		self.fullName = ko.observable('');
		self.displayName = ko.observable('');
		self.code = ko.observable(0);
	}

	function Profile() {
		var self = this;
		init.apply(self, arguments);
	}

	function ViewModel() {
		var self = this
			, wl = window.location
			, hash = wl.hash.replace(/^#/, '')
			, tabMatch = hash.match(/^(?:matrix|layout|profile|keys-available)$/)
			, tab = tabMatch ? tabMatch[0] : 'matrix'
		;
		init.apply(self, arguments);
		self.ready = ko.observable(false);
		self.tab = ko.observable(tab);
		self.keysAvailable = ko.observableArray();
		self.addKeyAvailable = function() {
			self.keysAvailable.push(new USBKey);
		};
		if (hash && !tabMatch) wl.hash = '';
	}

	window.vm = vm = new ViewModel(vm);
	ko.applyBindings(vm);
	vm.ready(true);
	$(function() {

	});
}());