
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
