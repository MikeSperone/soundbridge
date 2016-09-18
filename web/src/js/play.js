/**
 * Created by Mike on 8/30/16.
 */

class Play {
    constructor(audio, context) {

        this.audio = audio;
        this.context = context;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;


        let that = this;
        let req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function() {
            let audioData = req.response;

            that.context.decodeAudioData(audioData, function(buffer) {
                    that.buffer = buffer;
                    that.startSample();
                    that.volume.gain.value = 0;
                },
                function(e){console.log("Error with decoding audio data" + e.err);});
        };

        req.send();
    }

    startSample() {
        this.src = this.context.createBufferSource();
        this.src.buffer = this.buffer;

        this.src.loop = true;
        this.src.loopStart = this.loopStart;
        this.src.loopEnd = this.loopEnd;

        this.volume = this.context.createGain();
        this.src.connect(this.volume);
        this.volume.connect(this.context.destination);
        //this.volume.gain.value = 0;
        this.src.start();
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
        this.src.stop(0);
    }

    set position(x) {
        this.loopStart = x;
        console.log("loop start: "+this.loopStart);
    }
    get position() {
        return this.loopStart;
    }
    set length(x) {
        this.loopEnd = Math.min((this.position + x), this.duration);
        console.log("loop end: "+this.loopEnd);
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