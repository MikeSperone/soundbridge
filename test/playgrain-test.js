
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

});
