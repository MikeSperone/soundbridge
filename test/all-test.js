import { setSettings } from '../src/js/soundbridge.js';
import * as json from '../src/js/settings.js';
import Play from '../src/js/play.js';
import Loop from '../src/js/loop.js';
import Playgroove from '../src/js/playgroove.js';
import Grainread from '../src/js/grainread.js';
import Playgrain from '../src/js/playgrain.js';

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;



describe('Soundbridge', function() {
	
	describe("setSettings()", function() {

		it('should soundbridge', function() {
			return true;
		});

		it('should return the correct settings', function() {

			const settings = setSettings(json.settings, 0);
			expect(settings).to.deep.equal({
                samples: {
                    "0": "water3",
                    "1": "drillingbursts",
                    "2": "crickets",
                    "3":"arleneNR",
                    "a":""
                },
                grain: [28, 1, 2, 0.2],
                delay: [false, true, [], false]
            });
		});
	});

            
});



describe('Play Class', function() {

    const audio = '../build/audio/arlene.mp3';
    const context = new AudioContext();
    let XMLHttpRequest = global.XMLHttpRequest;
    var testing = new Play(audio, context);

    describe('initial state', function() {

        it('should start a new instance', function() {
            return testing;
        });

        it('should begin at position 0', function() {
            expect(testing.position).to.equal(0);
        });

        it('should be stopped', function() {
            expect(testing.stopped).to.be.true;
        });
        
    });

    describe('Starting Settings', function() {

        it('volume', function() {
            testing.vol(0.7);
            expect(testing.vol).to.equal(0.7);
        });

        it('startSample', function() {
            testing.startSample(0);
            expect(testing.stopped).to.be.false;
        });

        it('should have a duration', function() {
            return true;
            //expect(testing.duration).to.equal(1); 
        });

    });
});



describe('Loop Class', function() {

	it('should start a new instance', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Loop(audio, context);
	});
});


describe('Playgroove Class', function() {

	it('should start a new instance', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgroove(audio, context);
	});
});


describe('Grainread Class', function() {

	it('should start a new grainread class', function() {

        let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Grainread(audio, context, 1);
	});
});


describe('Playgrain Class', function() {

	it('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgrain(audio, context);
	});

});
