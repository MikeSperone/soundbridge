import 'web-audio-test-api';
import Grainread from '../src/js/grainread.js';

describe('Grainread Class', function() {

    before(function() {
        WebAudioTestAPI.setState("AudioContext#createStereoPanner", "enabled"); 
        
    });

	it('should start a new grainread class', function() {

        let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Grainread(audio, context, 1);
	});
});
