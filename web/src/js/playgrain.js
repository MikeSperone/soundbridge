/**
 * Created by Mike on 9/1/16.
 */

class Playgrain {

    constructor(audio, context) {

        this.audio = audio;
        this.context = context;

        this.a = new Grainread(this.audio, this.context, 1);
        this.b = new Grainread(this.audio, this.context, 1);
        this.c = new Grainread(this.audio, this.context, 1);
        this.d = new Grainread(this.audio, this.context, 1);
        this.e = new Grainread(this.audio, this.context, 1);
        this.f = new Grainread(this.audio, this.context, 1);
        this.g = new Grainread(this.audio, this.context, 1);

        this.a.phasor();
        this.b.phasor();
        this.c.phasor();
        this.d.phasor();
        this.e.phasor();
        this.f.phasor();
        this.g.phasor();
    }

    set fade(f) {
        this.a.fade = f;
        this.b.fade = f;
        this.c.fade = f;
        this.d.fade = f;
        this.e.fade = f;
        this.f.fade = f;
        this.g.fade = f;
    }

    set feedback(f) {
        this.a.feedback = f;
        this.b.feedback = f;
        this.c.feedback = f;
        this.d.feedback = f;
        this.e.feedback = f;
        this.f.feedback = f;
        this.g.feedback = f;
    }

    set read(gr) {
        this.a.read = gr;
        this.b.read = gr;
        this.c.read = gr;
        this.d.read = gr;
        this.e.read = gr;
        this.f.read = gr;
        this.g.read = gr;
    }

    set scatter(s) {
        this.a.scatter = s;
        this.b.scatter = s;
        this.c.scatter = s;
        this.d.scatter = s;
        this.e.scatter = s;
        this.f.scatter = s;
        this.g.scatter = s;
    }

    set spread(s) {
        this.a.spread = s;
        this.b.spread = s;
        this.c.spread = s;
        this.d.spread = s;
        this.e.spread = s;
        this.f.spread = s;
        this.g.spread = s;
    }

    set vol(w) {
        let v = w/3;
        this.a.vol = v;
        this.b.vol = v;
        this.c.vol = v;
        this.d.vol = v;
        this.e.vol = v;
        this.f.vol = v;
        this.g.vol = v;
    }



}