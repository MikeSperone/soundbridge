/**
 * Created by Mike on 8/30/16.
 */

export default class Play {
    audio: string;
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
    volume: GainNode;

    /**
     * Plays an audio file
     * @param {string} audio - path to audio file
     * @param {AudioContext} context - Web Audio Context
     * @param {number} vol - (optional) The starting volume.  Defaults to 0
     */
    constructor(audio: string, context: AudioContext, vol: number = 0) {

        console.info('play constructor');
        this.audio = audio;
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
        this.src = this.context.createBufferSource();

        this._bind.call(this);
    }

    _bind() {
        this.loadAudio = this.loadAudio.bind(this);
    }

    loadAudio() {
        console.info('play loading audio');
        return new Promise((resolve, reject) => {

            const handleAudioData = function(buffer) {
                console.info('handleAudioData');
                this.buffer = buffer;
                this.stopped = true;
                // TODO: this doesn't need to start here, right?
                // this.startSample();
                this.volume.gain.value = this.initialVol;
                this.audioLoadTimeOffset = (new Date().getTime() - this.contextCreationTime.getTime()) / 1000;
                return buffer;
            }.bind(this);

            const decodeAudioData = function() {
                const audioData = req.response;
                this.context.decodeAudioData(
                    audioData,
                    handleAudioData,
                    (e) => {
                        reject("Error decoding audio data" + e);
                    }
                );
                resolve(this.buffer);
            }.bind(this);

            let req = new XMLHttpRequest();

            req.open('GET', this.audio);
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
        console.log("startSample");

        offset = (offset < 0) ? 0 : offset;
        // TODO: offset here could be useful in the UI
        if (this.stopped === false) { this.stop(); }
        this.src = this.context.createBufferSource();
        this.src.buffer = this.buffer;

        this.src.loop = true;
        this.src.loopStart = this.loopStart;
        this.src.loopEnd = this.loopEnd;

        this.src.connect(this.volume);
        this.volume.connect(this.context.destination);
        this.startTime = this.context.currentTime - offset;

        //TODO: this, in the resize test is what is
        //"not, or no longer, usable"
        console.info('this.src', this.src);
        console.info('offset: ', offset);
        this.src.start(0, offset);
        this.stopped = false;
    }

    /**
     * Get the duration of the audio buffer
     * @return {number} The duration in ms
     */
    get duration(): number {
        return this.src.buffer ? this.src.buffer.duration : 0;
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
        this.src.loopStart = x;
    }
    get position(): number {
        return this.src.loopStart;
    }

    set loopLength(x: number) {
        console.info('set loopLength() - loopStart: ', this.loopStart);
        console.info('set loopLength() - x: ', x);
        console.info('set loopLength() - duration: ', this.duration);

        this.loopEnd = Math.min((this.loopStart + x), this.duration);
        console.info('set loopLength() - loopEnd: ', this.loopEnd);
    }

    get loopLength(): number {
        console.info('loopLength: ', this.loopEnd - this.loopStart);
        return this.loopEnd - this.loopStart;
    }

    toString() {
        return [{"audio": this.audio}, {"context": this.context}];
    }

    /**
     * Set the volume
     * @param {number} v 0.0 to 1.0
     */
    set vol(v: number) {
        this.volume.gain.value = this.maximumVolume * v;
    }

    changeVolume(v) {
        this.vol = v;
    }
    /**
     * Get the current volume
     * @return {Number} volume
     */
    get vol(): number {
        return this.volume.gain.value;
    }

    set volumeScalar(v) {
        this.maximumVolume = v;
        this.changeVolume(v, 0.01);
    }
    resize(x: number) {
        this.loopLength = x;
        this.startSample();
    }

}
