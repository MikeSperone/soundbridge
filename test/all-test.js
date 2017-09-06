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

});
