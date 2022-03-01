/* global it */
/* global describe */
/* global expect */
import Playgroove from '.';

export default () => (
    describe('Playgroove Class', function() {

        const context = new AudioContext();
        let pg = new Playgroove(context);

        before(function(done) {
            const audio = '/audio/arlene.mp3';
            pg.loadAudio(audio).then(() => done());
        });

        describe('initial values', function() {

            it('starts a new Playgroove class', function() {
                expect(pg).to.exist;
            });

            it('fills the audio buffer', function() {
                expect(pg.src.buffer.duration).to.be.within(90,91);
            });

        });

        describe('scaling functions', function() {

            const sf = Playgroove.SCALING_FUNCTIONS;
            it('delTime: .125 - .825(s)', () => {
                // try {
                    expect(sf.delTime(0)).to.be.closeTo(0.125, 0.001);
                    expect(sf.delTime(0.5)).to.be.closeTo(0.475, 0.001);
                    expect(sf.delTime(1)).to.be.closeTo(0.825, 0.001);
                // } catch (e) {
                //     console.error(e);
                // }
            });
            it('delFeedback: .075 - .495(s)', () => {
                // range of .075 - .495
                expect(sf.delFeedback(0)).to.be.closeTo(0.075, 0.001);
                expect(sf.delFeedback(0.5)).to.be.closeTo(0.285, 0.001);
                expect(sf.delFeedback(1)).to.be.closeTo(0.495, 0.001);
            });
            it('pbRate: .225 - 1.485(s)', () => {
                // should get a range of 0.225 to 1.485
                expect(sf.pbRate(0)).to.be.closeTo(0.225, 0.001);
                expect(sf.pbRate(0.5)).to.be.closeTo(0.855, 0.001);
                expect(sf.pbRate(1)).to.be.closeTo(1.485, 0.001);
            });
        });

        describe('parameters', function() {

            const sf = Playgroove.SCALING_FUNCTIONS;
            const delta = 0.001;
            it('sets the scaled delay time', function(done) {
                pg.delTime(0.125);
                const expectedValue = sf.delTime(0.125);
                setTimeout(() => {
                    expect(pg.delay.delayTime.value).to.be.closeTo(expectedValue, delta);
                    done();
                }, 10);
            });

            it('sets the scaled delay feedback', function(done) {
                pg.delFeedback(0.5);
                const expectedValue = sf.delFeedback(0.5);
                setTimeout(() => {
                    expect(pg.feedback.gain.value).to.be.closeTo(expectedValue, delta);
                    done();
                }, 10);
            });

            it('sets the scaled playback rate', function(done) {
                pg.pbRate(0.25);
                const expectedValue = sf.pbRate(0.25);
                setTimeout(() => {
                    try {
                        expect(pg.src.playbackRate.value).to.be.closeTo(expectedValue, delta);
                    } catch (e) {
                        done(e);
                    }
                    done();
                }, 10);
            });

            it('sets the volume', function(done) {
                pg.vol = 0.75;
                setTimeout(() => {
                    try {
                        expect(pg.volume.gain.value).to.equal(0.75);
                    } catch (e) {
                        done(e);
                    }
                    done();
                }, 55);
            });
            it('sets the volume to 0', function(done) {
                pg.vol = 0;
                setTimeout(() => {
                    try {
                        expect(pg.volume.gain.value).to.equal(0);
                    } catch (e) {
                        done(e);
                    }
                    done();
                }, 55);
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
