import 'web-audio-test-api';
import Play from '../src/js/play.js';

describe('Play Class', function() {

	it.skip('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Play(audio, context);
	});
});
