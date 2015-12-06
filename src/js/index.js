(function () {
	var DeckWatcher = require('./lib/DeckWatcher.js');
	var DeckCropper = require('./lib/DeckCropper.js');
	var Constants = require('./lib/Constants.js');
	
	var MAX_HEIGHT = window.screen.availHeight - (window.outerHeight - window.innerHeight);
	
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
	
	window.onload = function () {
		var deckImage = document.getElementById('deckImage');
		
		console.log('Ready!');
		DeckWatcher.startWatching(Constants.INPUT_DIR, function (screenshotFile, done) {
			DeckCropper.cropDeck(screenshotFile	, function (err, deckImageFile) {
				if (err) return console.error(err);
						
				var image = new Image();
				image.src = deckImageFile;
				
				image.onload = function () {
					deckImage.setAttribute('width', image.width);
					deckImage.setAttribute('height', image.height);
					deckImage.getContext('2d').drawImage(image, 0, 0);
					
					//resizeViewPort(image.bitmap.width, image.bitmap.height);
					resizeViewPort(image.width, MAX_HEIGHT); // - for streaming mode
					
					done();
				}
			});
		});
	};
})();