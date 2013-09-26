function getSize(chunk) {
	return Buffer.isBuffer(chunk)
		? chunk.length
		: Buffer.byteLength(chunk)
	;
}

function trimHtml(chunk, encoding) {
	return chunk
		.toString(encoding)
		.replace(/>\s+</g, '><')
		.replace(/\s{2,}/g, ' ')
	;
}

module.exports = function trimmer() {
	return function trimmer(req, res, next) {
		var write = res.write;

		function rewrite(chunk, encoding) {
			var html = trimHtml(chunk, encoding)
				, buffer = new Buffer(html, encoding)
			;
			res.setHeader('Content-Length', getSize(buffer));
			return write.call(res, buffer, encoding);
		}

		res.write = function(chunk, encoding) {
			var type = res.getHeader('Content-Type') || ''
				, isHtml = type.indexOf('text/html') >= 0
			;
			return isHtml
				? rewrite(chunk, encoding)
				: write.apply(res, arguments)
			;
		};

		next();
	};
};