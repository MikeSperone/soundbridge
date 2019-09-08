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

        this.audio = audio;
        this.context = context;
        this.contextCreationTime = new Date();
        this.startTime = 0;
        this.audioLoadTimeOffset = 0;
        this.initialVol = vol;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.stopped = true;
        this.volume = this.context.createGain();
        this.src = this.context.createBufferSource();

    }

    loadAudio() {
        return new Promise(resolve => {
            var that = this;

            let req = new XMLHttpRequest();

            req.open('GET', that.audio);
            req.responseType = 'arraybuffer';

            req.onreadystatechange = function() {
                if (this.readyState == 4) {
                    let audioData = req.response;

                    that.context.decodeAudioData(audioData, function(buffer) {
                            that.buffer = buffer;
                            that.stopped = true;
                        // TODO: this doesn't need to start here, right?
                            // that.startSample();
                            that.volume.gain.value = that.initialVol;
                            that.audioLoadTimeOffset = (new Date().getTime() - that.contextCreationTime.getTime()) / 1000;
                            resolve(buffer);
                        },
                        (e) => {
                            console.log("Error decoding audio data" + e);
                        }
                    );
                }
            };

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
        if (this.stopped === false) { this.stop(); }
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
        return this.src.buffer ? this.src.buffer.duration : 0;
    }

    play() {
        if (this.src) {
            this.src.start();
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

    set len(x: number) {
        this.loopEnd = Math.min((this.position + x), this.duration);
    }

    get len(): number {
        return this.src.loopEnd - this.src.loopStart;
    }

    toString() {
        return [{"audio": this.audio}, {"context": this.context}];
    }

    /**
     * Set the volume
     * @param {number} v 0.0 to 1.0
     */
    set vol(v: number) {
        this.volume.gain.value = v;
    }

    /**
     * Get the current volume
     * @return {Number} volume
     */
    get vol(): number {
        return this.volume.gain.value;
    }

    resize(x: number) {
        this.len = x;
        this.startSample();
    }

}
