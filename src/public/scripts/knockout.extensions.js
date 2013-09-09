/*jshint devel: true, browser: true, white: false, forin: true, plusplus: true, maxerr: 1000, indent: 2, jquery: true */
/*global _, ko */
(function() {
	'use strict';

	ko.extenders.throttleDeferred = function(target, timeout) {
		target.throttleEvaluation = timeout;
		return target;
	};

	ko.computed.fn.filterByProperty = ko.observableArray.fn.filterByProperty = function(propName, matchValue, options) {
		var matches = [];
		options = $.extend({
			maintainSort: false
			, missing: 'throw' // throw || remove || include
			, equal: true
			, identity: true
		}, options);
		return ko.computed(function() {
			var allItems = this()
				, current
				, currentValue
				, index
				, hasProp
				, matched
			;
			matchValue = ko.utils.unwrapObservable(matchValue);
			if (!options.maintainSort) {
				matches = [];
			}
			for (var i = 0; i < allItems.length; i++) {
				current = allItems[i];
				index = $.inArray(current, matches);
				hasProp = propName in current;
				if (!hasProp) {
					if (options.missing === 'throw') {
						throw new Error('filterByProperty() exception: could not find key in object: ' + propName);
					} else if (options.missing === 'include' && index === -1) {
						matches.push(current);
					}
				}
				currentValue = ko.utils.unwrapObservable(current[propName]);
				matched = options.equal
					? options.identity
						? currentValue === matchValue
						: currentValue == matchValue
					: options.identity
						? currentValue !== matchValue
						: currentValue != matchValue
				;
				if (matched) {
					if (index === -1) {
						matches.push(current);
					}
				} else if (index !== -1) {
					matches.splice(index, 1);
				}
			}
			if (options.maintainSort) {
				// remove items that no longer appear in allItems (ex: we're in a filtered filter)
				for (var i = matches.length - 1; i >= 0; i--) {
					var current = matches[i];
					if (allItems.indexOf(current) === -1) {
						matches.splice(i, 1);
					}
				}
			}
			return matches;
		}, this);
	};

	ko.computed.fn.firstByProperty = ko.observableArray.fn.firstByProperty = function() {
		var filtered = ko.utils.unwrapObservable(this.filterByProperty.apply(this, arguments));
		if (!filtered.length) return null;
		return filtered[0];
	};

	// data-bind="tooltip: 'someID'"
	// data-bind="tooltip: { track: false, template: 'someID' }"
	ko.bindingHandlers.tooltip = {
		update: function(elem, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var defaults = {
				track: true
				, delay: 0
			};
			var options = valueAccessor();
			var template = null;
			var isPO = $.isPlainObject(options);
			template = isPO ? options.template : options;
			options = isPO ? $.extend(defaults, options) : defaults;
			delete options.template;
			options.bodyHandler = function() {
				var ctnr = document.createElement('div');
				var useBindingContext = !$.isPlainObject(options.templateData) || $.isEmptyObject(options.templateData);
				ko.renderTemplate(template, useBindingContext ? bindingContext : options.templateData, { templateEngine: ko.nativeTemplateEngine.instance }, ctnr);
				return ctnr;
			}
			$(elem).tooltip(options);
		}
	};

	ko.bindingHandlers.focusOnce = {
		init: function(elem) {
			$(elem).focus();
		}
	};

	ko.bindingHandlers.hidden = {
		update: function(element, valueAccessor) {
			ko.bindingHandlers.visible.update(element, function() { return !ko.utils.unwrapObservable(valueAccessor()); });
		}
	};

	ko.observableInt = function(initialValue) {
		var underlyingObservable = ko.observable()
			, computed = ko.computed({
				read: underlyingObservable
				, write: function(value) {
					var parsed = parseInt(value, 10);
					if (!isNaN(parsed)) {
						underlyingObservable(parsed);
					} else if (value == '') {
						underlyingObservable(0);
					}
				}
		});

		computed(initialValue);
		return computed;
	};

	ko.bindingHandlers.intValue = {
		init: function(element, valueAccessor, allBindingsAccessor) {
			var underlyingObservable = valueAccessor()
				, elem = $(element)
				, interceptor = ko.computed({
					read: underlyingObservable,
					write: function(value) {
						var parsed = parseInt(value);
						if (!isNaN(parsed)) {
							underlyingObservable(parsed);
							elem.val(parsed);
						} else if (value == '') {
							underlyingObservable(0);
							elem.val('');
						} else if (value.length === 1) {
							elem.val('');
						} else {
							elem.val(underlyingObservable());
						}
					}
				})
			;
			ko.bindingHandlers.value.init(element, function() { return interceptor; }, allBindingsAccessor);
		},
		update: ko.bindingHandlers.value.update
	};

	ko.bindingHandlers['class'] = {
      'update': function(element, valueAccessor) {
          if (element['__ko__previousClassValue__']) {
              $(element).removeClass(element['__ko__previousClassValue__']);
          }
          var value = ko.utils.unwrapObservable(valueAccessor());
          $(element).addClass(value);
          element['__ko__previousClassValue__'] = value;
      }
  };
}());