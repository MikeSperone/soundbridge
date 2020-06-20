/* global it */
/* global describe */
/* global expect */
import Playgroove from '.';

export default () => (
    describe('Playgroove Class', function() {

        let audio = '/audio/arlene.mp3';
        let context = new AudioContext();
        let pg = new Playgroove(audio, context);

        before(function(done) {
            pg.loadAudio().then(() => done());
        });

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

        describe('parameters', function() {

            it('sets the delay time', function() {
                console.info('setting delTime TEST');
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

            it('sets the volume', function(done) {
                pg.vol = 0.75;
                setTimeout(() => {
                    expect(pg.volume.gain.value).to.equal(0.75);
                    done();
                }, 50);
            });
            it('sets the volume to 0', function(done) {
                pg.vol = 0;
                setTimeout(() => {
                    expect(pg.volume.gain.value).to.equal(0);
                    done();
                }, 50);
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

    })
);
