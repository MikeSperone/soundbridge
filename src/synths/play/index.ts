import clip from '../utils/clip';
/**
 * Created by Mike on 8/30/16.
 */
"use strict";

export default class Play {
    context: AudioContext;
    contextCreationTime: Date;
    startTime: number;
    initialVol: number;
    buffer: AudioBuffer | null;
    audioLoadTimeOffset: number;
    loopStart: number;
    loopEnd: number;
    stopped: boolean;
    src: AudioBufferSourceNode;
    filtering: boolean;
    maximumVolume: number;
    volume: GainNode;
    lowPass: BiquadFilterNode;

    /**
     * Plays an audio file
     * @param {AudioContext} context - Web Audio Context
     * @param {number} vol - (optional) The starting volume.  Defaults to 0
     */
    constructor(context: AudioContext, vol: number = 0) {

        console.info('play constructor');
        this.context = context;
        this.contextCreationTime = new Date();
        this.startTime = 0;
        this.audioLoadTimeOffset = 0;
        this.initialVol = vol;
        this.maximumVolume = 1.0;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.stopped = true;
        this.volume = this.context.createGain();
        this.filtering = false;
        this.lowPass = this.context.createBiquadFilter();
        this.lowPass.type = 'lowpass';
        this.volume.gain.value = this.initialVol;
        this.src = this.context.createBufferSource();

        this._bind.call(this);
    }

    _bind() {
        this.loadAudio = this.loadAudio.bind(this);
        this.startSample = this.startSample.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.resize = this.resize.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.connectFilter = this.connectFilter.bind(this);
        this.disconnectFilter = this.disconnectFilter.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
    }

    /**
     * Loads the audio file
     * @param {string} audio - path to audio file
     */
    loadAudio(audio: string) {
        console.info('Play() loading audio...');
        return new Promise((resolve, reject) => {

            const handleAudioData = (buffer: AudioBuffer) => {
                console.info('handleAudioData()');
                this.buffer = buffer;
                console.info('this.buffer: ', this.buffer);
                this.stopped = true;
                this.audioLoadTimeOffset = (new Date().getTime() - this.contextCreationTime.getTime()) / 1000;
                resolve(this.buffer);
            };

            const decodeAudioData = () => {
                console.info('decodeAudioData()');
                const audioData = req.response;
                this.context.decodeAudioData(
                    audioData,
                    handleAudioData,
                    (e) => {
                        reject("Error decoding audio data" + e);
                    }
                );
            };

            let req = new XMLHttpRequest();

            req.open('GET', audio);
            req.responseType = 'arraybuffer';

            req.onerror = () => reject('Error requesting audio data');
            req.onload = decodeAudioData;

            req.send();
        });
    }

    /**
     * Start playing the sample at new offset
     * @param {number} offset - How far into the sample to start playback (s)
     */
    startSample(offset = 0) {

        offset = (offset < 0) ? 0 : offset;
        // TODO: offset here could be useful in the UI
        if (this.stopped === false) { this.stop(); }
        this.src = this.context.createBufferSource();
        this.src.buffer = this.buffer;

        this.src.loop = true;
        this.src.loopStart = this.loopStart;
        this.src.loopEnd = this.loopEnd;

        this.src.connect(this.volume);
        this.filtering && this.connectFilter();
        this.volume.connect(this.context.destination);
        this.startTime = this.context.currentTime - offset;

        this.src.start(0, offset);
        this.stopped = false;
    }

    /**
     * Get the duration of the audio buffer
     * @return {number} The duration in ms
     */
    get duration(): number {
        return this.buffer ? this.buffer.duration : 0;
    }

    play() {
        if (this.src) {
            this.src.start();
            this.stopped = false;
        }
    }

    /**
     * Stop the audio
     */
    stop() {
        if (this.stopped === false) {
            this.src.stop(0);
            this.stopped = true;
        }
    }

    /**
     * Gets the elapsed time from start of playback
     * @return time from start of playback until now (ms)
     */
    get elapsedTime(): number {
        return this.context.currentTime - this.startTime;
    }

    set position(x: number) {
        this.loopStart = x;
    }
    get position(): number {
        return this.loopStart;
    }

    set loopLength(x: number) {
        this.loopEnd = Math.min((this.loopStart + x), this.duration);
    }

    get loopLength(): number {
        return this.loopEnd - this.loopStart;
    }

    /**
     * Set the volume
     * @param {number} v 0.0 to 1.0
     */
    set vol(v: number) {
        this.changeVolume(v);
    }

    changeVolume(v: number, t:number =0.001) {
        const volume = this.maximumVolume * clip(v);
        this.volume.gain
            .cancelScheduledValues(this.context.currentTime);
        this.volume.gain
            .linearRampToValueAtTime(volume, this.context.currentTime + t);
    }

    /**
     * Get the current volume
     * @return {Number} volume
     */
    get vol(): number {
        return this.volume.gain.value;
    }

    set volumeScalar(v: number) {
        this.maximumVolume = clip(v);
        this.changeVolume(this.vol);
    }

    set filter(f: number) {
        this.changeFilter(f, 0);
    }

    get filter(): number {
        return this.lowPass.frequency.value;
    }

    connectFilter() {
        this.src.disconnect(0);
        this.src.connect(this.lowPass);
        this.lowPass.connect(this.volume);
        this.filtering = true;
    }

    disconnectFilter() {
        this.src.disconnect(this.lowPass);
        this.lowPass.disconnect(this.volume);
        this.src.connect(this.volume);
        this.filtering = false;
    }

    changeFilter(f: number, t: number = 0.001) {
        if (f === 0 && this.filtering) {
            console.info('disconnecting the filter');
            this.disconnectFilter();
            return;
        }
        if (!this.filtering) {
            console.info('connecting the filter');
            this.filtering = true;
        }
        console.info('setting the filter to ', f);
        this.lowPass.frequency.linearRampToValueAtTime(f, this.context.currentTime + t);
    }

    resize(x: number) {
        this.loopLength = x;
        this.startSample();
    }

}
