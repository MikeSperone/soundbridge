/**
 * Playgrain class
 *
 * Created by Mike on 9/1/16.
 */

import Grainread from '../grainread';

export default class Playgrain {

    // a: Grainread;
    // b: Grainread;
    // c: Grainread;
    // d: Grainread;
    // e: Grainread;
    // f: Grainread;
    // g: Grainread;
    // h: Grainread;
    // i: Grainread;
    // j: Grainread;

    constructor(audio: string, context: AudioContext) {

        // this.a = new Grainread(audio, context, 1);
        // this.b = new Grainread(audio, context, 1);
        // this.c = new Grainread(audio, context, 1);
        // this.d = new Grainread(audio, context, 1);
        // this.e = new Grainread(audio, context, 1);
        // this.f = new Grainread(audio, context, 1);
        // this.g = new Grainread(audio, context, 1);
        // this.h = new Grainread(audio, context, 1);
        // this.i = new Grainread(audio, context, 1);
        // this.j = new Grainread(audio, context, 1);
        this.maximumVolume = 1.0;
        this.grainArray = [];
        const numberOfGrains = 10;
        let i = 0;
        for(i; i < numberOfGrains; i++) {
            this.grainArray.push(new Grainread(audio, context, 1));
        }

        this.setAllValues = this.setAllValues.bind(this);
        this.callAllFunctions = this.callAllFunctions.bind(this);
        // this.grainArray = [
        //     this.a,
        //     this.b,
        //     this.c,
        //     this.d,
        //     this.e,
        //     this.f,
        //     this.g,
        //     this.h,
        //     this.i,
        //     this.j
        // ]
    }

    setAllValues(parameter, value) {
        this.grainArray.forEach(g => {
            g[parameter] = value;
        });
    }

    callAllFunctions(fnName, args=[]) {
        this.grainArray.forEach(g => g[fnName](...args));
    }

    loadAudio() {
        let promises = [];
        this.setAllValues(g => promises.push(g.loadAudio()));
        return Promise.all(promises);
        // return Promise.all([
        //     this.a.loadAudio(),
        //     this.b.loadAudio(),
        //     this.c.loadAudio(),
        //     this.d.loadAudio(),
        //     this.e.loadAudio(),
        //     this.f.loadAudio(),
        //     this.g.loadAudio(),
        //     this.h.loadAudio(),
        //     this.i.loadAudio(),
        //     this.j.loadAudio(),
        // ]);
    }

    /**
     * Sets the fade
     *
     *
     */
    set fade(f: number) {
        this.setAllValues('fade', f);
        // this.a.fade = f;
        // this.b.fade = f;
        // this.c.fade = f;
        // this.d.fade = f;
        // this.e.fade = f;
        // this.f.fade = f;
        // this.g.fade = f;
        // this.h.fade = f;
        // this.i.fade = f;
        // this.j.fade = f;
    }

    /**
     * Sets the delay feedback
     */
    set feedback(f: number) {
        console.info('feedback: ', f);
        this.setAllValues('feedback', f);
        // this.a.feedback = f;
        // this.b.feedback = f;
        // this.c.feedback = f;
        // this.d.feedback = f;
        // this.e.feedback = f;
        // this.f.feedback = f;
        // this.g.feedback = f;
        // this.h.feedback = f;
        // this.i.feedback = f;
        // this.j.feedback = f;
    }

    /**
     * Sets the read point
     */
    set read(gr: number) {
        this.setAllValues('read', gr);
        // this.a.read = gr;
        // this.b.read = gr;
        // this.c.read = gr;
        // this.d.read = gr;
        // this.e.read = gr;
        // this.f.read = gr;
        // this.g.read = gr;
        // this.h.read = gr;
        // this.i.read = gr;
        // this.j.read = gr;
    }

    /**
     * Sets the grain scatter amount
     */
    set scatter(s:number) {
        this.setAllValues('scatter', s);
        // this.a.scatter = s;
        // this.b.scatter = s;
        // this.c.scatter = s;
        // this.d.scatter = s;
        // this.e.scatter = s;
        // this.f.scatter = s;
        // this.g.scatter = s;
        // this.h.scatter = s;
        // this.i.scatter = s;
        // this.j.scatter = s;
    }

    /**
     * Sets the grain spread
     */
    set spread(s:number) {
        this.setAllValues('spread', s);
        // this.a.spread = s;
        // this.b.spread = s;
        // this.c.spread = s;
        // this.d.spread = s;
        // this.e.spread = s;
        // this.f.spread = s;
        // this.g.spread = s;
        // this.h.spread = s;
        // this.i.spread = s;
        // this.j.spread = s;
    }

    /**
     *  Starts playing
     */
    start() {
        this.callAllFunctions('start');
        // this.a.start();
        // this.b.start();
        // this.c.start();
        // this.d.start();
        // this.e.start();
        // this.f.start();
        // this.g.start();
        // this.h.start();
        // this.i.start();
        // this.j.start();
    }

    /**
     * Stops playing
     */
    stop() {
        this.callAllFunctions('stop');
        // this.a.stop();
        // this.b.stop();
        // this.c.stop();
        // this.d.stop();
        // this.e.stop();
        // this.f.stop();
        // this.g.stop();
        // this.h.stop();
        // this.i.stop();
        // this.j.stop();
    }

    changeVolume(v: number, t: number) {
        this.callAllFunctions('changeVolume', [v, t]);
    }

    /**
     * Sets the volume
     */
    set vol(v:number) {
        this.volume = this.maximumVolume * v;
        this.setAllValues('vol', v);
        // this.a.vol = v;
        // this.b.vol = v;
        // this.c.vol = v;
        // this.d.vol = v;
        // this.e.vol = v;
        // this.f.vol = v;
        // this.g.vol = v;
        // this.h.vol = v;
        // this.i.vol = v;
        // this.j.vol = v;
    }
    /** Returns the volume*/
    get vol() {
        return this.volume;
    }

    set volumeScalar(v) {
        this.maximumVolume = v;
        this.changeVolume(v, 0.01);
    }
}
