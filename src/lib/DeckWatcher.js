var fs = require('fs');
var path = require('path');

var processedFiles = [];

function startWatching(directory, cb) {
	fs.watch(directory, function (event, filename) {
		if (event == 'change') {
			if (filename.indexOf('Hearthstone Screenshot') > -1 && filename.indexOf('.png') > -1 && processedFiles.indexOf(filename) == -1) {
				function done() {
					fs.unlinkSync(path.join(directory, filename));
				}
				
				processedFiles.push(filename);
				cb(filename, done);
			}
		}
	});
}

module.exports = { startWatching: startWatching };