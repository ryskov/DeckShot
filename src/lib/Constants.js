var path = require('path');

module.exports = {
	INPUT_DIR:  path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], 'Desktop'),
	OUTPUT_DIR: path.join('./', 'TestImages', 'out'),
}