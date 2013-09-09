function getSize(chunk) {
	return Buffer.isBuffer(chunk)
	? chunk.length
	: Buffer.byteLength(chunk);
}

module.exports = function trimmer() {
	return function trimmer(req, res, next) {
		var end = res.end
			, write = res.write
			, isHtml
		;

		res.on('header', function() {
			//res.removeHeader('Content-Length');
		});

		res.write = function(chunk, encoding) {
			var type = res.getHeader('Content-Type') || '';
			isHtml = type.indexOf('text/html') >= 0;
			if (!isHtml) {
				write.apply(res, arguments);
				return;
			}

			var html = chunk
				.toString(encoding)
				.replace(/>\s+</g, '><')
				.replace(/\s{2,}/g, ' ')
			;

			var buffer = new Buffer(html, encoding);

			try {
				res.setHeader('Content-Length', getSize(buffer));
			} catch (ex) {}
			return write.call(res, buffer, encoding);
		};

		next();
	};
};