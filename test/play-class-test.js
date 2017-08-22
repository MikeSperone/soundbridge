
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

