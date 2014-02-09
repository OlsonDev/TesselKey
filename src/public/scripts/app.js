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

	function createInitArgs(args, defaults) {
		args = $.makeArray(args);
		while (args.length < 2) args.push(null);
		args.push(defaults);
		return args;
	}

	function init(overrides, parent, defaults) {
		var self = this
			, data = _.extend({}, defaults, overrides);
		;

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
		var self = this
			, args = createInitArgs(arguments, {
				numRows: 10
				, numColumns: 10
				, keys: []
			})
		;
		init.apply(self, args);
	}

	function LayoutKey() {
		var self = this
			, args = createInitArgs(arguments, { row: 0, column: 0 });
		init.apply(self, args);
	}

	function USBKey() {
		var self = this
			, args = createInitArgs(arguments, {
				fullName: ''
				, displayName: ''
				, numCode: 0
			})
		;
		init.apply(self, args);
	}

	function Profile() {
		var self = this
			, args = createInitArgs(arguments, {})
		;
		init.apply(self, args);
	}

	function ViewModel() {
		var self = this
			, wl = window.location
			, hash = wl.hash.replace(/^#/, '')
			, tabMatch = hash.match(/^(?:matrix|layout|profile|keys-available)$/)
			, tab = tabMatch ? tabMatch[0] : 'matrix'
			, args = createInitArgs(arguments, {
				ready: false
				, tab: tab
				, keysAvailable: []
			})
		;
		init.apply(self, args);
		self.addKeyAvailable = function() {
			self.keysAvailable.push(new USBKey);
		};
		self.loadKeysAvailable = function() {

		};
		self.saveKeysAvailable = function() {
			var filename = $.trim(prompt('Filename?', 'keys-available.json'));
			if (!filename) return;
			tk.download(filename, ko.mapping.toJSON(self.keysAvailable));
		};
		if (hash && !tabMatch) wl.hash = '';
	}

	window.vm = vm = new ViewModel(vm);
	ko.applyBindings(vm);
	vm.ready(true);
	$(function() {

	});
}());