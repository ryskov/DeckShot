var Jimp = require('jimp');
var path = require('path');

var Constants = require('./Constants.js');

var ASPECT_RATIO_WIDTH = 4;
var ASPECT_RATIO_HEIGHT = 3;

var Y_END_COLOR = Jimp.rgbaToInt(61, 59, 60, 255);

Number.prototype.colorSimilarTo = function (color, allowedDifference) {
	allowedDifference = allowedDifference || 6;
	
	var thisRGBA = Jimp.intToRGBA(parseInt(this));
	var colorRGBA = Jimp.intToRGBA(color);
	
	return 	thisRGBA.r.withinRange(colorRGBA.r - allowedDifference, colorRGBA.r + allowedDifference) && 
			thisRGBA.g.withinRange(colorRGBA.g - allowedDifference, colorRGBA.g + allowedDifference) && 
			thisRGBA.b.withinRange(colorRGBA.b - allowedDifference, colorRGBA.b + allowedDifference);
}

Number.prototype.withinRange = function (lowest, highest) {
	return this >= lowest && this <= highest;
}

function processImage(testImage, cb) {
	Jimp.read(path.join(Constants.INPUT_DIR, testImage), function (err, image) {
		if (err) return cb(err);
		
		console.log('picture dimensions:', image.bitmap.width, image.bitmap.height);
		var appHeight = image.bitmap.height;
		var appWidth = (appHeight / ASPECT_RATIO_HEIGHT) * ASPECT_RATIO_WIDTH;
		
		var paddingWidth = (image.bitmap.width - appWidth) / 2;
		
		var deckX1 = paddingWidth + (appWidth / 1.29);
		var deckWidth = (paddingWidth + appWidth) - deckX1 - (appWidth / 20);
		
		var _y = null;
		
		image.crop(deckX1, 0, deckWidth, appHeight - (appHeight / 10))
			.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
				var color = Jimp.rgbaToInt(this.bitmap.data[ idx + 0 ], this.bitmap.data[ idx + 1 ], this.bitmap.data[ idx + 2 ], this.bitmap.data[ idx + 3 ]);
				
				if (color.colorSimilarTo(Y_END_COLOR))
					_y = y;
			})
			.crop(0, 0, image.bitmap.width, _y)
			.write(path.join(Constants.OUTPUT_DIR, testImage), function (err) {
				if (err) return cb(err);
				
				cb(null, path.join(Constants.OUTPUT_DIR, testImage));
			});
	});
}

module.exports = { cropDeck: processImage };