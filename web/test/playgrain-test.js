import 'web-audio-test-api';
import Playgrain from '../src/js/playgrain.js';
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

describe('Playgrain Class', function() {

	it('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgrain(audio, context);
	});
});
