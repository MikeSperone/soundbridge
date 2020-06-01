import Playgrain from '.';

export default () => (
    describe('Playgrain Class', function() {

        const audio = '/audio/arlene.mp3';
        let context = new AudioContext();
        let pg = new Playgrain(audio, context);
        let grainArray = pg.grainArray;

        console.log("playgrain: ", pg);
        const checkEqual = (property, value) => {
            grainArray.forEach(g => {
                expect(g[property]).to.equal(value);
            })
        }

        it('starts a new play class', function() {
            expect(pg).to.exist;
        });

        it('includes 10 instances of Grainread', function() {
            expect(grainArray.length).to.equal(10);
            grainArray.forEach(g => expect(g.constructor.name).to.equal('Grainread'));
        });

        it('sets the fade amount for all instances', function() {
            pg.fade = .75;
            grainArray.forEach(g => expect(g.fade).to.equal(.75));
            checkEqual('fade', .75);
        });

        it('sets the feedback position for all instances', function() {
            pg.feedback = .5;
            checkEqual('feedback', .5);
        });

        it('sets the read position for all instances', function() {
            pg.read = 12;
            checkEqual('read', 12);
        });

        it('sets the scatter differently for each instance', function() {
            pg.scatter = .75;
            expect(grainArray[0].scatter).to.not.equal(grainArray[9].scatter);
            expect(grainArray[1].scatter).to.not.equal(grainArray[8].scatter);
            expect(grainArray[2].scatter).to.not.equal(grainArray[7].scatter);
            expect(grainArray[3].scatter).to.not.equal(grainArray[6].scatter);
            expect(grainArray[4].scatter).to.not.equal(grainArray[5].scatter);
            expect(grainArray[5].scatter).to.not.equal(grainArray[4].scatter);
            expect(grainArray[6].scatter).to.not.equal(grainArray[3].scatter);
            expect(grainArray[7].scatter).to.not.equal(grainArray[2].scatter);
            expect(grainArray[8].scatter).to.not.equal(grainArray[1].scatter);
            expect(grainArray[9].scatter).to.not.equal(grainArray[0].scatter);
        });
        
        it('sets the spread value for all instances', function() {
            pg.spread = 2;
            checkEqual('spread', 2);
        });

        it('sets the volume for playgrain', function(done) {
            pg.vol = 0.5;
            setTimeout(() => {
                expect(pg.vol).to.equal(0.5);
                done();
            }, 50);
        });

        it('sets the volume for all instances', function(done) {
            pg.vol = 0.5;
            setTimeout(() => {
                try {
                    checkEqual('vol', 0.5);
                }
                catch (e) {
                    console.error(e);
                    return e;
                }
                done();
            }, 100);
        });
        
        it('starts playing all instances', function() {
            pg.start();
            checkEqual('stopped', false);
        });
        
        it('stops playing all instances', function() {
            pg.stop();
            checkEqual('stopped', true);
        });
    })
);
