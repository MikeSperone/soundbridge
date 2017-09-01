// import { setSettings } from '../src/js/soundbridge.js';
// import * as json from '../src/js/settings.js';
import Play from '../src/js/play.js';
import Loop from '../src/js/loop.js';
// import Playgroove from '../src/js/playgroove.js';
// import Grainread from '../src/js/grainread.js';
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

    let audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let loop = new Loop(audio, context);

    it('starts a new instance', function() {
        console.log(loop);
        return loop;
    });

    it('sets sensorPos for values above 20', function() {
        loop.sensor(25);
        expect(loop.sensorPos).to.equal(25);
    });

    it('sets position to 0 for values under 11', function() {
        loop.sensor(10);
        expect(loop.position).to.equal(0);
    });

    it('sets length to duration for values < 11', function() {
        loop.sensor(8);
        expect(loop.length).to.equal(loop.duration);
    });

    describe('loop points', function() {
        it(' if value is under 21', function() {
            loop.loop(20);
            expect(loop.position).to.equal(0.9 * loop.duration);
        });

        it('loops at the correct spot for 21', function() {
            loop.loop(21);
            expect(loop.position).to.equal(0.3 * loop.duration);
        });
        it('loops at the correct spot for 23', function() {
            loop.loop(23);
            expect(loop.position).to.equal(0.4 * loop.duration);
        });
        it('loops at the correct spot for 25', function() {
            loop.loop(25);
            expect(loop.position).to.equal(0.5 * loop.duration);
        });
        it('loops at the correct spot for 27', function() {
            loop.loop(27);
            expect(loop.position).to.equal(0.6 * loop.duration);
        });
        it('loops at the correct spot for 29', function() {
            loop.loop(29);
            expect(loop.position).to.equal(0.7 * loop.duration);
        });
        it('loops at the correct spot for 31', function() {
            loop.loop(31);
            expect(loop.position).to.equal(0.8 * loop.duration);
        });
        it('loops at the correct spot for 33', function() {
            loop.loop(33);
            expect(loop.position).to.equal(0.9 * loop.duration);
        });
    });

    describe('delay', function() {
        it('adds things when delay is on', function() {
            loop.delaySwitch(true);
            expect(loop).to.have.property('delay');
            expect(loop).to.have.property('feedback');
            expect(loop).to.have.property('merge');;
        });
        it('sets the delay pan', function() {
            expect(loop).to.have.property('panL');
            expect(loop.panL.pan.value).to.equal(-1);
        });
        it('turns the delay off', function() {
            loop.delaySwitch(false);
            expect(() => { loop.delaySwitch(false); }).to.throw;
        });

    });

    afterEach(function() {
        loop.stop();
    });

});
