import 'web-audio-test-api';
import Loop from '../src/js/loop.js';

describe('Loop Class', function() {

	it.skip('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Loop(audio, context);
	});
});