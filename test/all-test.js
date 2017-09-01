// import { setSettings } from '../src/js/soundbridge.js';
// import * as json from '../src/js/settings.js';
import Play from '../src/js/play.js';
import Loop from '../src/js/loop.js';
// import Playgroove from '../src/js/playgroove.js';
import Grainread from '../src/js/grainread.js';
// import Playgrain from '../src/js/playgrain.js';

// var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
// var expect = chai.expect;



describe('Play Class', function() {

    const audio = '/audio/arlene.mp3';
    const context = new AudioContext();
    let XMLHttpRequest = global.XMLHttpRequest;
    var testing;

    describe('initial state', function() {

        before(function(done) {
            var wait = 2000;
            this.timeout(wait);
            testing = new Play(audio, context);
            setTimeout(function() {
                done();
            }, wait/2);
        });

        it('starts a new instance', function() {
            console.log("testing: ", testing);
            expect(testing).to.be.an("object");
        });

        it('names the audio file', function() {
            expect(testing.audio).to.equal(audio);
        });

        it('fills the audio buffer', function() {
            expect(testing.buffer.duration).to.be.within(90,91);
        });

        it('begins at position 0', function() {
            expect(testing.position).to.equal(0);
        });

        it('is stopped', function() {
            expect(testing.stopped).to.be.true;
        });

        it('begins at volume level 0', function() {
            expect(testing.vol).to.equal(0);
        }); 
    });

    describe('things', function() {

        it('vol()', function() {
            testing.vol = 0.5;
            expect(testing.vol).to.equal(0.5);
        });

        it('startSample()', function() {
            testing.startSample(0);
            expect(testing.stopped).to.be.false;
        });

        it('stop()', function() {
            testing.startSample(0);
            testing.stop();
            expect(testing.stopped).to.be.true;
        });

        it.skip('elapsedTime()', function() {

        });

        it('position()', function() {
            testing.position = 10.25;
            expect(testing.position).to.equal(10.25);
            testing.position = 2;
            expect(testing.position).to.equal(2);
        });

        it('len()', function() {
            testing.len = 5;
            expect(testing.len).to.equal(5);
            expect(testing.loopEnd - testing.loopStart).to.equal(5);
        });
        
        it('do not allow length to be greater than the sample', function() {
            testing.position = 0;
            testing.len = 5000;
            expect(testing.loopEnd).to.equal(testing.duration);
        });

        afterEach(function() {
            testing.stop();
        });

    });
});



describe('Loop Class', function() {

	it('should start a new instance', function() {
		let audio = '/audio/arlene.mp3';
		let context = new AudioContext();
		return new Loop(audio, context);
	});
});


describe('Grainread Class', function() {

    let audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let gr = new Grainread(audio, context, 1);

    console.log("grainread: ", gr);
    describe('initial values', function() {

        it('starts a new grainread class', function() {
            expect(gr).to.exist;
        });

        it('sets the audio', function() {
            expect(gr.audio).to.equal('/audio/arlene.mp3');
        });

        it('fills the audio buffer', function() {
            expect(gr.buffer.duration).to.be.within(90,91);
        });

        it('sets fb values', function() {
            expect(gr.fb_amount).to.equal(0);
            expect(gr.fb_position).to.equal(121);
            expect(gr.fb_jitter).to.equal(272);
        });

        it('is stopped', function() {
            expect(gr.stopped).to.be.true;
        });

        it('begins at volume level 1', function() {
            expect(gr.vol).to.equal(1);
        });

    });

    describe('setters and getters', function() {

        it('volume', function() {
            gr.vol = .75;
            expect(gr.vol).to.equal(.75);
        });

        it('delay', function() {
            gr.delays = .25;
            expect(gr.delays).to.equal(.25);
        });

        it('feedback', function() {
            gr.feedback = .5;
            expect(gr.feedback).to.equal(.5);
        });

        it('position', function() {
            gr.position = 25;
            expect(gr.position).to.equal(25);
        });

        // loopLength, speed, fade, read, speedspread, spread, scatter
    });

    describe('methods', function() {

        it('restarts at a given time', function() {
            gr.restartAtTime(10);
            expect(gr.stopped).to.be.false;
        });

        it('starts and stops', function() {
            gr.start();
            expect(gr.stopped).to.be.false;
            gr.stop();
            expect(gr.stopped).to.be.true;
        });

        after(function() {
            gr.stop();
        });

    });

});
