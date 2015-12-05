(function () {
	var resizeViewPort = function(width, height) {
		if (window.outerWidth) {
			window.resizeTo(
				width + (window.outerWidth - window.innerWidth),
				height + (window.outerHeight - window.innerHeight)
			);
		} else {
			window.resizeTo(500, 500);
			window.resizeTo(
				width + (500 - document.body.offsetWidth),
				height + (500 - document.body.offsetHeight)
			);
		}
	};
	
	var deckImage = null;
	
	window.onload = function () {
		deckImage = document.getElementById('deckImage');
		
		console.log('Ready!');
	}
	
	var Jimp = require('jimp');
	var path = require('path');
	
	var MAX_HEIGHT = window.screen.availHeight - (window.outerHeight - window.innerHeight);
	
	var ASPECT_RATIO_WIDTH = 4;
	var ASPECT_RATIO_HEIGHT = 3;
	
	var INPUT_DIR = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], 'Desktop');
	var OUTPUT_DIR = path.join('./', 'TestImages', 'out');
	
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
		Jimp.read(path.join(INPUT_DIR, testImage), function (err, image) {
			if (err) return console.error(err);
			
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
				.write(path.join(OUTPUT_DIR, testImage), function (err) {
					resizeViewPort(image.bitmap.width, MAX_HEIGHT);
					
					deckImage.setAttribute('width', image.bitmap.width);
      				deckImage.setAttribute('height', image.bitmap.height);
					 
					var src = new Image();
					src.src = path.join(OUTPUT_DIR, testImage);
					
					src.onload = function () {
						deckImage.getContext('2d').drawImage(src, 0, 0);
					};
				});
		});
	}
	
	var fs = require('fs');
	var processedFiles = [];
	
	fs.watch(INPUT_DIR, function (event, filename) {
		if (event == 'change') {
			if (filename.indexOf('Hearthstone Screenshot') > -1 && filename.indexOf('.png') > -1 && processedFiles.indexOf(filename) == -1) {
				processedFiles.push(filename);
				processImage(filename, function () {
					fs.unlinkSync(path.join(INPUT_DIR, filename));
				});
			}
		}
	})
})();