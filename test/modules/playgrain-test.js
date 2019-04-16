import Playgrain from 'playgrain';

describe('Playgrain Class', function() {

    const audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let pg = new Playgrain(audio, context);

    console.log("playgrain: ", pg);

    it('starts a new play class', function() {
        expect(pg).to.exist;
    });

    it('includes 10 instances of Grainread', function() {
        expect(pg.a.constructor.name).to.equal("Grainread");
        expect(pg.b.constructor.name).to.equal("Grainread");
        expect(pg.c.constructor.name).to.equal("Grainread");
        expect(pg.d.constructor.name).to.equal("Grainread");
        expect(pg.e.constructor.name).to.equal("Grainread");
        expect(pg.f.constructor.name).to.equal("Grainread");
        expect(pg.g.constructor.name).to.equal("Grainread");
        expect(pg.h.constructor.name).to.equal("Grainread");
        expect(pg.i.constructor.name).to.equal("Grainread");
        expect(pg.j.constructor.name).to.equal("Grainread");
    });

    it('sets the fade amount for all instances', function() {
        pg.fade = .75;
        expect(pg.a.fade).to.equal(.75);
        expect(pg.b.fade).to.equal(.75);
        expect(pg.c.fade).to.equal(.75);
        expect(pg.d.fade).to.equal(.75);
        expect(pg.e.fade).to.equal(.75);
        expect(pg.f.fade).to.equal(.75);
        expect(pg.g.fade).to.equal(.75);
        expect(pg.h.fade).to.equal(.75);
        expect(pg.i.fade).to.equal(.75);
        expect(pg.j.fade).to.equal(.75);
    });

    it('sets the feedback position for all instances', function() {
        pg.feedback = .5;
        expect(pg.a.feedback).to.equal(.5);
        expect(pg.b.feedback).to.equal(.5);
        expect(pg.c.feedback).to.equal(.5);
        expect(pg.d.feedback).to.equal(.5);
        expect(pg.e.feedback).to.equal(.5);
        expect(pg.f.feedback).to.equal(.5);
        expect(pg.g.feedback).to.equal(.5);
        expect(pg.h.feedback).to.equal(.5);
        expect(pg.i.feedback).to.equal(.5);
        expect(pg.j.feedback).to.equal(.5);
    });

    it('sets the read position for all instances', function() {
        pg.read = 12;
        expect(pg.a.read).to.equal(12);
        expect(pg.b.read).to.equal(12);
        expect(pg.c.read).to.equal(12);
        expect(pg.d.read).to.equal(12);
        expect(pg.e.read).to.equal(12);
        expect(pg.f.read).to.equal(12);
        expect(pg.g.read).to.equal(12);
        expect(pg.h.read).to.equal(12);
        expect(pg.i.read).to.equal(12);
        expect(pg.j.read).to.equal(12);
    });

    it('sets the scatter differently for each instance', function() {
        pg.scatter = .75;
        expect(pg.a.scatter).to.not.equal(pg.j.scatter);
        expect(pg.b.scatter).to.not.equal(pg.a.scatter);
        expect(pg.c.scatter).to.not.equal(pg.b.scatter);
        expect(pg.d.scatter).to.not.equal(pg.c.scatter);
        expect(pg.e.scatter).to.not.equal(pg.d.scatter);
        expect(pg.f.scatter).to.not.equal(pg.e.scatter);
        expect(pg.g.scatter).to.not.equal(pg.f.scatter);
        expect(pg.h.scatter).to.not.equal(pg.g.scatter);
        expect(pg.i.scatter).to.not.equal(pg.h.scatter);
        expect(pg.j.scatter).to.not.equal(pg.i.scatter);
    });
    
    it('sets the spread value for all instances', function() {
        pg.spread = 2;
        expect(pg.a.spread).to.equal(2);
        expect(pg.b.spread).to.equal(2);
        expect(pg.c.spread).to.equal(2);
        expect(pg.d.spread).to.equal(2);
        expect(pg.e.spread).to.equal(2);
        expect(pg.f.spread).to.equal(2);
        expect(pg.g.spread).to.equal(2);
        expect(pg.h.spread).to.equal(2);
        expect(pg.i.spread).to.equal(2);
        expect(pg.j.spread).to.equal(2);
    });

    it('sets the volume for all instances', function() {
        pg.vol = 0.5;
        expect(pg.a.vol).to.equal(0.5);
        expect(pg.b.vol).to.equal(0.5);
        expect(pg.c.vol).to.equal(0.5);
        expect(pg.d.vol).to.equal(0.5);
        expect(pg.e.vol).to.equal(0.5);
        expect(pg.f.vol).to.equal(0.5);
        expect(pg.g.vol).to.equal(0.5);
        expect(pg.h.vol).to.equal(0.5);
        expect(pg.i.vol).to.equal(0.5);
        expect(pg.j.vol).to.equal(0.5);
    });
    
    it('starts playing all instances', function() {
        pg.start();
        expect(pg.a.stopped).to.be(false);
        expect(pg.b.stopped).to.be(false);
        expect(pg.c.stopped).to.be(false);
        expect(pg.d.stopped).to.be(false);
        expect(pg.e.stopped).to.be(false);
        expect(pg.f.stopped).to.be(false);
        expect(pg.g.stopped).to.be(false);
        expect(pg.h.stopped).to.be(false);
        expect(pg.i.stopped).to.be(false);
        expect(pg.j.stopped).to.be(false);
    });
    
    it('stops playing all instances', function() {
        pg.stop();
        expect(pg.a.stopped).to.be(true);
        expect(pg.b.stopped).to.be(true);
        expect(pg.c.stopped).to.be(true);
        expect(pg.d.stopped).to.be(true);
        expect(pg.e.stopped).to.be(true);
        expect(pg.f.stopped).to.be(true);
        expect(pg.g.stopped).to.be(true);
        expect(pg.h.stopped).to.be(true);
        expect(pg.i.stopped).to.be(true);
        expect(pg.j.stopped).to.be(true);
    });
});
