/**
 * Created by Mike on 8/30/16.
 */

class Play {
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

        req.onload = function() {
            let audioData = req.response;

            that.context.decodeAudioData(audioData, function(buffer) {
                    that.buffer = buffer;
                    that.stopped = true;
                    that.startSample();
                    that.volume.gain.value = vol;
                    that.audioLoadTimeOffset = (new Date() - that.contextCreationTime) / 1000;
                },
                function(e){console.log("Error with decoding audio data" + e.err);});
        };

        req.send();
    }

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

    get duration() {
        return this.src.buffer.duration;
    }

    play() {
        if (this.src) {
            this.src.start();
        }
    }
    stop() {
        if (this.stopped === false) {
            this.src.stop(0);
            this.stopped = true;
        }
    }

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

    set vol(v) {
        this.volume.gain.value = v;
    }

}