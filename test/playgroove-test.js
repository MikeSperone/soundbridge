import 'web-audio-test-api';
import Playgroove from '../src/js/playgroove.js';

describe('Playgroove Class', function() {

	it('should start a new instance', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgroove(audio, context);
	});
});
