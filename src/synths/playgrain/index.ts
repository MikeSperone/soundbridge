/**
 * Playgrain class
 *
 * Created by Mike on 9/1/16.
 */

import Grainread from '../grainread';

export default class Playgrain {

    volume: number;
    maximumVolume: number;
    grainArray: Grainread[];
    _isPlaying: boolean;

    /**
     * Grain synthesis of an audio file
     * @param {AudioContext} context - Web Audio Context
     */
    constructor(context: AudioContext, vol: number = 0) {

        this.volume = vol;
        this.maximumVolume = 1.0;
        this.grainArray = [];
        this._isPlaying = false;
        const numberOfGrains = 10;
        let i = 0;
        for(i; i < numberOfGrains; i++) {
            this.grainArray.push(new Grainread(context, 1));
        }

        this.setAllValues = this.setAllValues.bind(this);
        this.callAllFunctions = this.callAllFunctions.bind(this);
    }

    setAllValues(parameter: string, value: number) {
        this.grainArray.forEach(g => {
            // @ts-expect-error
            g[parameter] = value;
        });
    }

    callAllFunctions(fnName: string, args=[]) {
        // @ts-expect-error
        this.grainArray.forEach(g => g[fnName](...args));
    }

    loadAudio(audio: string) {
        let promises = this.grainArray.map(g => g.loadAudio(audio));
        return Promise.all(promises);
    }

    set delays(d: number) {
        this.setAllValues('delays', d);
    }

    /** Sets the fade */
    set fade(f: number) {
        this.setAllValues('fade', f);
    }

    /** Sets the delay feedback */
    set feedback(f: number) {
        this.setAllValues('feedback', f);
    }

    /** Sets the read point */
    set read(gr: number) {
        this.setAllValues('read', gr);
    }

    /** Sets the grain scatter amount */
    set scatter(s:number) {
        this.setAllValues('scatter', s);
    }

    /** Sets the grain spread */
    set spread(s:number) {
        this.setAllValues('spread', s);
    }

    /** Starts playing */
    start() {
        this._isPlaying = true;
        this.callAllFunctions('start');
    }

    /** Stops playing */
    stop() {
        this._isPlaying = false;
        this.callAllFunctions('stop');
    }

    changeVolume(v: number, t: number) {
        // @ts-expect-error
        this.callAllFunctions('changeVolume', [v, t]);
    }

    /** Sets the volume */
    set vol(v:number) {
        this.volume = this.maximumVolume * v;
        this.setAllValues('vol', v);
    }
    /** Returns the volume*/
    get vol() {
        return this.volume;
    }

    get isPlaying() {
        return this._isPlaying;
    }

    set volumeScalar(v: number) {
        this.maximumVolume = v;
        this.changeVolume(v, 0.001);
    }
}
