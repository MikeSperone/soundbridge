import Play from '.';

export default () => (
    describe('Play Class', function() {

        const audio = '/audio/arlene.mp3';
        const context = new AudioContext();
        //let XMLHttpRequest = global.XMLHttpRequest;
        var testing = new Play(audio, context);

        describe('initial state', function() {

            before(function(done) {
                testing.loadAudio().then(() => done());
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
                // sample previously started ^^
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

            it('loopLength()', function() {
                testing.loopLength = 5;
                expect(testing.loopLength).to.equal(5);
                expect(testing.loopEnd - testing.loopStart).to.equal(5);
            });
            it('resize()', function() {
                testing.resize(5);
                expect(testing.loopLength).to.equal(5);
                expect(testing.loopEnd - testing.loopStart).to.equal(5);
            });

            it('do not allow loopLength to be greater than the sample', function() {
                testing.position = 0;
                testing.loopLength = 5000;
                expect(testing.loopEnd).to.equal(testing.duration);
            });

            afterEach(function() {
                testing.stop();
            });

        });
    })
);
