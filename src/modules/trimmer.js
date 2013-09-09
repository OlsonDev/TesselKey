function getSize(chunk) {
	return Buffer.isBuffer(chunk)
	? chunk.length
	: Buffer.byteLength(chunk);
}

module.exports = function trimmer() {
	return function trimmer(req, res, next) {
		var write = res.write
			, isHtml
		;

		res.write = function(chunk, encoding) {
			var type = res.getHeader('Content-Type') || ''
				, html
			;
			isHtml = type.indexOf('text/html') >= 0;
			if (!isHtml) {
				write.apply(res, arguments);
				return;
			}

			html = chunk
				.toString(encoding)
				.replace(/>\s+</g, '><')
				.replace(/\s{2,}/g, ' ')
			;

			var buffer = new Buffer(html, encoding);
			res.setHeader('Content-Length', getSize(buffer));
			return write.call(res, buffer, encoding);
		};

		next();
	};
};