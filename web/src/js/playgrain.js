/**
 * Playgrain class
 *
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
        this.h = new Grainread(this.audio, this.context, 1);
        this.i = new Grainread(this.audio, this.context, 1);
        this.j = new Grainread(this.audio, this.context, 1);

    }

    set fade(f) {
        this.a.fade = f;
        this.b.fade = f;
        this.c.fade = f;
        this.d.fade = f;
        this.e.fade = f;
        this.f.fade = f;
        this.g.fade = f;
        this.h.fade = f;
        this.i.fade = f;
        this.j.fade = f;
    }

    set feedback(f) {
        this.a.feedback = f;
        this.b.feedback = f;
        this.c.feedback = f;
        this.d.feedback = f;
        this.e.feedback = f;
        this.f.feedback = f;
        this.g.feedback = f;
        this.h.feedback = f;
        this.i.feedback = f;
        this.j.feedback = f;
    }

    set read(gr) {
        this.a.read = gr;
        this.b.read = gr;
        this.c.read = gr;
        this.d.read = gr;
        this.e.read = gr;
        this.f.read = gr;
        this.g.read = gr;
        this.h.read = gr;
        this.i.read = gr;
        this.j.read = gr;
    }

    set scatter(s) {
        this.a.scatter = s;
        this.b.scatter = s;
        this.c.scatter = s;
        this.d.scatter = s;
        this.e.scatter = s;
        this.f.scatter = s;
        this.g.scatter = s;
        this.h.scatter = s;
        this.i.scatter = s;
        this.j.scatter = s;
    }

    set spread(s) {
        this.a.spread = s;
        this.b.spread = s;
        this.c.spread = s;
        this.d.spread = s;
        this.e.spread = s;
        this.f.spread = s;
        this.g.spread = s;
        this.h.spread = s;
        this.i.spread = s;
        this.j.spread = s;
    }

    start() {
        this.a.start();
        this.b.start();
        this.c.start();
        this.d.start();
        this.e.start();
        this.f.start();
        this.g.start();
        this.h.start();
        this.i.start();
        this.j.start();
    }

    stop() {
        this.a.stop();
        this.b.stop();
        this.c.stop();
        this.d.stop();
        this.e.stop();
        this.f.stop();
        this.g.stop();
        this.h.stop();
        this.i.stop();
        this.j.stop();
    }
    set vol(v) {
        this.a.vol = v;
        this.b.vol = v;
        this.c.vol = v;
        this.d.vol = v;
        this.e.vol = v;
        this.f.vol = v;
        this.g.vol = v;
        this.h.vol = v;
        this.i.vol = v;
        this.j.vol = v;
    }



}
