import Grainread from './index.ts';

export default () => (
    describe('Grainread Class', function() {

        let audio = '/audio/arlene.mp3';
        let context = new window.AudioContext();
        let gr = new Grainread(context, 1);

        before(function(done) {
            gr.loadAudio(audio).then(() => done());
        });

        describe('initial values', function() {

            it('starts a new grainread class', function() {
                expect(gr).to.exist;
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

            it('volume', function(done) {
                gr.vol = .75;
                setTimeout(() => {
                    expect(gr.vol).to.equal(.75);
                    expect(gr.volume.gain.value).to.equal(.75);
                    done();
                }, 10);
            });

            it('delays', function() {
                gr.delays = .25;
                expect(gr.delays).to.equal(.25);
                expect(gr.delayA.delayTime.value).to.equal(.25);
            });

            it('feedback', function() {
                gr.feedback = .5;
                expect(gr.feedback).to.equal(.5);
                expect(gr.feedbackA.gain.value).to.equal(.5);
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

    })
);
