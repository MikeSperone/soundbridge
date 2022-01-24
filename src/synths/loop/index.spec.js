import Loop from '.';

export default () => (
    describe('Loop Class', function() {

        let audio = '/audio/arlene.mp3';
        let context = new AudioContext();
        let lp = new Loop(context);

        it('should start a new instance', function() {
            expect(lp).to.exist;
        });

        it('should load the audio', function(done) {
            lp.loadAudio(audio).then((b) => {
                expect(lp.play.buffer).to.exist;
                console.log('test buffer: ', lp.play.buffer);
                expect(lp.play.duration).to.exist;
                console.log('test duration: ', lp.play.duration);
                done();
            });
        });

        it('starts a loop at the correct spot', function() {
            lp.loop(0.3);
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
    })
);
