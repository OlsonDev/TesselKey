var temp    = require('temp')
	, path    = require('path')
	, express = require('express')
	, less    = require('less-middleware')
	, tmp     = path.join(temp.dir, 'TesselKey')
	, root    = __dirname
	, pub     = path.join(root, 'public')
	, images  = path.join(pub, 'images')
	, scripts = path.join(pub, 'scripts')
	, views   = path.join(root, 'views')
	, app     = express()
	, trimmer = require('./modules/trimmer.js')
;

app.disable('X-Powered-By');

app.configure(function() {
	app.use(express.compress());
	app.use(trimmer());
	app.use(express.favicon(path.join(images, 'favicon.ico')));
	app.use('/images',  express.static(images));
	app.use('/scripts', express.static(scripts));
	app.use(less({ src: pub, dest: tmp }));
	app.use(express.static(tmp));
	app.use(express.static(views));
});

app.listen(80);