// import { setSettings } from '../src/js/soundbridge.js';
// import * as json from '../src/js/settings.js';
import Play from '../src/js/play.js';
import Loop from '../src/js/loop.js';
import Playgroove from '../src/js/playgroove.js';
import Grainread from '../src/js/grainread.js';
import Playgrain from '../src/js/playgrain.js';

// var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
// var expect = chai.expect;



describe('Play Class', function() {

    const audio = '/audio/arlene.mp3';
    const context = new AudioContext();
    //let XMLHttpRequest = global.XMLHttpRequest;
    var testing;

    describe('initial state', function() {

        before(function(done) {
            var wait = 2500;
            this.timeout(wait);
            testing = new Play(audio, context);
            setTimeout(function() {
                done();
            }, wait - 200);
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

	let audio = '/audio/arlene.mp3';
	let context = new AudioContext();
	let lp = new Loop(audio, context);

	it('should start a new instance', function() {
		expect(lp).to.exist;
	});
	
	it('starts a loop at the correct spot', function() {
		lp.loop(22);
		expect(lp.position).to.equal(lp.duration * 0.3);
	});

	it('turns the delay on', function() {
		//lp.delaySwitch(true);
		//expect()... delay to be on
		
	});
	
	it('turns the delay off', function() {
		//lp.delaySwitch(false);
		//expect()... delay to be off
	});
});

/* global it */
/* global describe */
/* global expect */

describe('Playgroove Class', function() {

    let audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let pg = new Playgroove(audio, context);

    console.log(pg);
    describe('initial values', function() {

        it('starts a new Playgroove class', function() {
            expect(pg).to.exist;
        });

        it('sets the audio', function() {
            expect(pg.audio).to.equal('/audio/arlene.mp3');
        });

        it('fills the audio buffer', function() {
            expect(pg.src.buffer.duration).to.be.within(90,91);
        });

    });

    describe('utility functions', function() {

        it('restricts the value to between 0 and 1', function() {
            expect(pg._restrict(1.0001)).to.equal(1);
            expect(pg._restrict(-0.4)).to.equal(0);
        });

    });

    describe('parameters', function() {

        it('sets the delay time', function() {
            pg.delTime(0.125);
            expect(pg.delay.delayTime.value).to.equal(0.125);
        });

        it('sets the delay feedback', function() {
            pg.delFeedback(0.5);
            expect(pg.feedback.gain.value).to.equal(0.5);
        });

        it('sets the playback rate', function() {
            pg.pbRate(0.25);
            expect(pg.src.playbackRate.value).to.equal(0.25);
        });

        it('sets the volume', function() {
            pg.vol(0.75);
            expect(pg.volume.gain.value).to.equal(0.75);
        });
    });

    describe('delay switch', function() {
        
        it('turns the delay on', function() {
            pg.delaySwitch(true);
            pg.delay.disconnect(pg.feedback);
            pg.feedback.disconnect(pg.delay);
            //This ^^ should throw no errors...
            //  but if it does, this test will fail
        });
        
        it('turns the delay off', function() {
            pg.delaySwitch(false);
            expect(() => pg.delay.disconnect(pg.feedback)).to.throw;
            expect(() => pg.feedback.disconnect(pg.delay)).to.throw;
        });

    });

});


describe('Grainread Class', function() {

    let audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let gr = new Grainread(audio, context, 1);

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
            expect(gr.volume.gain.value).to.equal(.75);
        });

        it('delays', function() {
            gr.delays = .25;
            expect(gr.delays).to.equal(.25);
            expect(gr.delayA.delayTime.value).to.equal(.25);
        });

        it('feedback', function() {
            gr.feedback = .5;
            expect(gr.feedback).to.equal(.5);
            expect(gr.fbkA.gain.value).to.equal(.5);
        });

        it('position', function() {
            gr.position = 25;
            expect(gr.position).to.equal(25);
            expect(gr.src.loopStart).to.equal(25);
        });

        it('loopLength', function() {
            gr.loopLength = 10;
            expect(gr.loopLength).to.equal(10);
            expect(gr.src.loopEnd - gr.src.loopStart).to.equal(10);
        });
        it('speed', function() {
            gr.speed = 0.5;
            expect(gr.speed).to.equal(0.5);
            expect(gr.g_speed).to.equal(0.5);
        });
        it('fade', function() {
            gr.fade = 100;
            expect(gr.fade).to.equal(100);
            expect(gr.g_fade).to.equal(100);
        });
        it('read', function() {
            gr.read = 1;
            expect(gr.read).to.equal(1);
            expect(gr.g_read).to.equal(1);
        });
        it('speedspread', function() {
            gr.speedspread = 12;
            expect(gr.speedspread).to.equal(12);
            expect(gr.g_speedspread).to.equal(12);
        });
        it('spread', function() {
            gr.spread = 2;
            expect(gr.spread).to.equal(2);
            expect(gr.g_spread).to.equal(2);
        });
        it('scatter', function() {
            gr.scatter = 19;
            expect(gr.scatter).to.equal(19);
            expect(gr.g_scatter).to.equal(19);
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


describe('Playgrain Class', function() {

    const audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let pg = new Playgrain(audio, context);

    console.log("playgrain: ", pg);

    it('starts a new play class', function() {
        expect(pg).to.exist;
    });

    it('includes 10 instances of Grainread', function() {
        expect(pg.a.constructor.name).to.equal("Grainread");
        expect(pg.b.constructor.name).to.equal("Grainread");
        expect(pg.c.constructor.name).to.equal("Grainread");
        expect(pg.d.constructor.name).to.equal("Grainread");
        expect(pg.e.constructor.name).to.equal("Grainread");
        expect(pg.f.constructor.name).to.equal("Grainread");
        expect(pg.g.constructor.name).to.equal("Grainread");
        expect(pg.h.constructor.name).to.equal("Grainread");
        expect(pg.i.constructor.name).to.equal("Grainread");
        expect(pg.j.constructor.name).to.equal("Grainread");
    });

    it('sets the fade amount for all instances', function() {
        pg.fade = .75;
        expect(pg.a.fade).to.equal(.75);
        expect(pg.b.fade).to.equal(.75);
        expect(pg.c.fade).to.equal(.75);
        expect(pg.d.fade).to.equal(.75);
        expect(pg.e.fade).to.equal(.75);
        expect(pg.f.fade).to.equal(.75);
        expect(pg.g.fade).to.equal(.75);
        expect(pg.h.fade).to.equal(.75);
        expect(pg.i.fade).to.equal(.75);
        expect(pg.j.fade).to.equal(.75);
    });

    it('sets the feedback position for all instances', function() {
        pg.feedback = .5;
        expect(pg.a.feedback).to.equal(.5);
        expect(pg.b.feedback).to.equal(.5);
        expect(pg.c.feedback).to.equal(.5);
        expect(pg.d.feedback).to.equal(.5);
        expect(pg.e.feedback).to.equal(.5);
        expect(pg.f.feedback).to.equal(.5);
        expect(pg.g.feedback).to.equal(.5);
        expect(pg.h.feedback).to.equal(.5);
        expect(pg.i.feedback).to.equal(.5);
        expect(pg.j.feedback).to.equal(.5);
    });

    it('sets the read position for all instances', function() {
        pg.read = 12;
        expect(pg.a.read).to.equal(12);
        expect(pg.b.read).to.equal(12);
        expect(pg.c.read).to.equal(12);
        expect(pg.d.read).to.equal(12);
        expect(pg.e.read).to.equal(12);
        expect(pg.f.read).to.equal(12);
        expect(pg.g.read).to.equal(12);
        expect(pg.h.read).to.equal(12);
        expect(pg.i.read).to.equal(12);
        expect(pg.j.read).to.equal(12);
    });

    it('sets the scatter differently for each instance', function() {
        pg.scatter = .75;
        expect(pg.a.scatter).to.not.equal(pg.j.scatter);
        expect(pg.b.scatter).to.not.equal(pg.a.scatter);
        expect(pg.c.scatter).to.not.equal(pg.b.scatter);
        expect(pg.d.scatter).to.not.equal(pg.c.scatter);
        expect(pg.e.scatter).to.not.equal(pg.d.scatter);
        expect(pg.f.scatter).to.not.equal(pg.e.scatter);
        expect(pg.g.scatter).to.not.equal(pg.f.scatter);
        expect(pg.h.scatter).to.not.equal(pg.g.scatter);
        expect(pg.i.scatter).to.not.equal(pg.h.scatter);
        expect(pg.j.scatter).to.not.equal(pg.i.scatter);
    });
    
    it('sets the spread value for all instances', function() {
        pg.spread = 2;
        expect(pg.a.spread).to.equal(2);
        expect(pg.b.spread).to.equal(2);
        expect(pg.c.spread).to.equal(2);
        expect(pg.d.spread).to.equal(2);
        expect(pg.e.spread).to.equal(2);
        expect(pg.f.spread).to.equal(2);
        expect(pg.g.spread).to.equal(2);
        expect(pg.h.spread).to.equal(2);
        expect(pg.i.spread).to.equal(2);
        expect(pg.j.spread).to.equal(2);
    });

    it('sets the volume for all instances', function() {
        pg.vol = 0.5;
        expect(pg.a.vol).to.equal(0.5);
        expect(pg.b.vol).to.equal(0.5);
        expect(pg.c.vol).to.equal(0.5);
        expect(pg.d.vol).to.equal(0.5);
        expect(pg.e.vol).to.equal(0.5);
        expect(pg.f.vol).to.equal(0.5);
        expect(pg.g.vol).to.equal(0.5);
        expect(pg.h.vol).to.equal(0.5);
        expect(pg.i.vol).to.equal(0.5);
        expect(pg.j.vol).to.equal(0.5);
    });
    
    it('starts playing all instances', function() {
        pg.start();
        expect(pg.a.stopped).to.be(false);
        expect(pg.b.stopped).to.be(false);
        expect(pg.c.stopped).to.be(false);
        expect(pg.d.stopped).to.be(false);
        expect(pg.e.stopped).to.be(false);
        expect(pg.f.stopped).to.be(false);
        expect(pg.g.stopped).to.be(false);
        expect(pg.h.stopped).to.be(false);
        expect(pg.i.stopped).to.be(false);
        expect(pg.j.stopped).to.be(false);
    });
    
    it('stops playing all instances', function() {
        pg.stop();
        expect(pg.a.stopped).to.be(true);
        expect(pg.b.stopped).to.be(true);
        expect(pg.c.stopped).to.be(true);
        expect(pg.d.stopped).to.be(true);
        expect(pg.e.stopped).to.be(true);
        expect(pg.f.stopped).to.be(true);
        expect(pg.g.stopped).to.be(true);
        expect(pg.h.stopped).to.be(true);
        expect(pg.i.stopped).to.be(true);
        expect(pg.j.stopped).to.be(true);
    });
});
