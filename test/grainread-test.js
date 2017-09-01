
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
