/**
 * Playgrain class
 *
 * Created by Mike on 9/1/16.
 */

import Grainread from '../grainread';

export default class Playgrain {

    constructor(audio: string, context: AudioContext) {

        this.maximumVolume = 1.0;
        this.grainArray = [];
        const numberOfGrains = 10;
        let i = 0;
        for(i; i < numberOfGrains; i++) {
            this.grainArray.push(new Grainread(audio, context, 1));
        }

        this.setAllValues = this.setAllValues.bind(this);
        this.callAllFunctions = this.callAllFunctions.bind(this);
    }

    setAllValues(parameter: string, value) {
        this.grainArray.forEach(g => {
            g[parameter] = value;
        });
    }

    callAllFunctions(fnName: string, args=[]) {
        this.grainArray.forEach(g => g[fnName](...args));
    }

    loadAudio() {
        let promises = [];
        this.grainArray.forEach(g => promises.push(g.loadAudio()));
        return Promise.all(promises);
    }

    /**
     * Sets the fade
     *
     *
     */
    set fade(f: number) {
        this.setAllValues('fade', f);
    }

    /**
     * Sets the delay feedback
     */
    set feedback(f: number) {
        this.setAllValues('feedback', f);
    }

    /**
     * Sets the read point
     */
    set read(gr: number) {
        this.setAllValues('read', gr);
    }

    /**
     * Sets the grain scatter amount
     */
    set scatter(s:number) {
        this.setAllValues('scatter', s);
    }

    /**
     * Sets the grain spread
     */
    set spread(s:number) {
        this.setAllValues('spread', s);
    }

    /**
     *  Starts playing
     */
    start() {
        this.callAllFunctions('start');
    }

    /**
     * Stops playing
     */
    stop() {
        this.callAllFunctions('stop');
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
    }
    /** Returns the volume*/
    get vol() {
        return this.volume;
    }

    set volumeScalar(v: number) {
        this.maximumVolume = v;
        this.changeVolume(v, 0.01);
    }
}
