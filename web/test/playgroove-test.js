import 'web-audio-test-api';
import Playgroove from '../src/js/playgroove.js';

describe('Playgroove Class', function() {

	it.skip('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Plagroove(audio, context);
	});
});
