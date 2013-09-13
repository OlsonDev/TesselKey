var path       = require('path')
	, fs         = require('fs')
	, webpFile   = /\.webp$/
	, webpAccept = /(^|,)image\/webp(,|;|$)/
;
module.exports = function webp(prefix) {
	return function webp(req, res, next) {
		var webp = path.join(prefix, req.url)
			, png
			, jpg
		;
		if (!webpFile.test(req.url) || !fs.existsSync(webp)) {
			next();
			return;
		}

		res.setHeader('Vary', 'Accept');

		if (webpAccept.test(req.headers.accept)) {
			next();
			return;
		}

		png = req.url.replace(webpFile, '.png');
		if (fs.existsSync(path.join(prefix, png))) {
			req.url = png;
			next();
			return;
		}

		jpg = req.url.replace(webpFile, '.jpg');
		if (fs.existsSync(path.join(prefix, jpg))) {
			req.url = jpg;
			next();
			return;
		}

		next();
	};
};