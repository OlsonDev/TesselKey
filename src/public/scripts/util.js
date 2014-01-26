// http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
(function() {
	'use strict';
	var fnProto = Function.prototype
		, ctorName = fnProto.name !== undefined
		, funcName = (/function\s+(.+)\s*\(/)
		, getObjectTypeName = function() {
			var results = funcName.exec(this.constructor.toString());
			return results && results.length ? results[1] : '';
		}
	;

	if (!ctorName && Object.defineProperty !== undefined) {
		Object.defineProperty(Function.prototype, 'name', {
			get: getObjectTypeName
			, set: function(value) {}
		});
	}

	_.objectTypeName = function(obj) {
		if (ctorName) return obj.constructor.name;
		return getObjectTypeName.call(obj);
	};
}());
(function() {
	'use strict';
	var from = 'ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûµñçżź'
		, to   = 'aaaaaaaaaceeeeeiiiilnoooooosstuuuuunczz'
		, accented = new RegExp('[' + from + ']', 'g')
		, slug = /[A-Z]+(?![a-z])|[A-Z](?=[a-z])|\d+/g
		, unaccent = function(str) {
			return str
				.toLowerCase()
				.replace(accented, function($1) {
					var i = from.indexOf($1);
					return to.charAt(i) || '-';
				})
				.replace(/\s+/g, '-')
				.replace(/(-){2,}|-$/g, '$1')
			;
		}
	;
	_.slugify = function(str) {
		if (!str) return str;
		if (str.length > 3) {
			str = str.replace(slug, function($1, i, s) {
				var hyphen = i === 0 || s[i-1] === '-' ? '' : '-';
				return hyphen + $1;
			});
		}
		return unaccent(str);
	};
}());
(function() {
	'use strict';
	var old = ko.mapping.toJSON;
	ko.mapping.toJSON = function(obj) {
		var args = $.makeArray(arguments)
			, js = ko.mapping.toJS(obj)
		;
		args[0] = js;
		return ko.toJSON.apply(ko, args);
	};
}());