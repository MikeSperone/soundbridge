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
        this.changeVolume = this.changeVolume.bind(this);
    }

    loadAudio() {
        console.info('Play() loading audio...');
        return new Promise((resolve, reject) => {

            const handleAudioData = function(buffer) {
                console.info('handleAudioData()');
                this.buffer = buffer;
                console.info('this.buffer: ', this.buffer);
                this.stopped = true;
                // TODO: this doesn't need to start here, right?
                // this.startSample();
                this.audioLoadTimeOffset = (new Date().getTime() - this.contextCreationTime.getTime()) / 1000;
                resolve(this.buffer);
            }.bind(this);

            const decodeAudioData = function() {
                console.info('decodeAudioData()');
                const audioData = req.response;
                this.context.decodeAudioData(
                    audioData,
                    handleAudioData,
                    (e) => {
                        reject("Error decoding audio data" + e);
                    }
                );
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

    toString() {
        return [{"audio": this.audio}, {"context": this.context}];
    }

    /**
     * Set the volume
     * @param {number} v 0.0 to 1.0
     */
    set vol(v: number) {
        this.changeVolume(this.maximumVolume * v, 0);
    }

    changeVolume(v: number, t:number =0.001) {
        this.volume.gain
            .cancelScheduledValues(this.context.currentTime);
        this.volume.gain
            .linearRampToValueAtTime(v, this.context.currentTime + t);
    }
    /**
     * Get the current volume
     * @return {Number} volume
     */
    get vol(): number {
        return this.volume.gain.value;
    }

    set volumeScalar(v: number) {
        this.maximumVolume = v;
        // TODO: should I change the volume here?
        this.changeVolume(this.vol);
    }
    resize(x: number) {
        this.loopLength = x;
        this.startSample();
    }

}
