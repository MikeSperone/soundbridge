/**
 * Created by Mike on 8/30/16.
 */

export default class Play {
    /**
     * Plays an audio file
     * @param {string} audio - path to audio file
     * @param {AudioContext} context - Web Audio Context
     * @param {number} vol - (optional) The starting volume.  Defaults to 0
     */
    constructor(audio, context, vol = 0) {

        this.audio = audio;
        this.context = context;
        this.contextCreationTime = new Date();
        this.startTime = null;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.stopped = true;


        let that = this;
        let req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                let audioData = req.response;

                that.context.decodeAudioData(audioData, function(buffer) {
                        that.buffer = buffer;
                        that.stopped = true;
                        that.startSample();
                        that.volume.gain.value = vol;
                        that.audioLoadTimeOffset = (new Date() - that.contextCreationTime) / 1000;
                        console.log(that);
                    },
                    function(e){console.log("Error with decoding audio data" + e.err);});
            }
        };

        req.send();

    }

    /**
     * Start playing the sample at new offset
     * @param {number} offset - How far into the sample to start playback (s)
     */
    startSample(offset = 0) {
        console.log("startSample");

        offset = (offset < 0) ? 0 : offset;
        if (this.stopped === false) { this.stop(); }
        this.src = this.context.createBufferSource();
        this.volume = this.context.createGain();
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
    get duration() {
        return this.src.buffer.duration;
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
    get elapsedTime(){
        return this.context.currentTime - this.startTime;
    }

    set position(x) {
        this.loopStart = x;
    }
    get position() {
        return this.loopStart;
    }
    set length(x) {
        this.loopEnd = Math.min((this.position + x), this.duration);
    }
    get length() {
        return this.src.loopEnd - this.src.loopStart;
    }
    toString() {
        return [{"audio": this.audio}, {"context": this.context}];
    }

    /**
     * Set the volume
     * @param {number} v 0.0 to 1.0
     */
    set vol(v) {
        this.volume.gain.value = v;
    }
    
    /**
     * Get the current volume
     * @return {Number} volume
     */
    get vol() {
        return this.volume.gain.value;
    }
}
