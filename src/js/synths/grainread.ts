/**
 * Grainread class
 * a single series of grains
  for the playgrain class
 * Created by Mike Sperone on 8/25/16.
 *
*/
export default class Grainread {
    audio:      string;
    context:    AudioContext;
    g_read:     number;
    g_multiply: number;
    g_fade:     number;
    g_spread:   number;
    g_scatter:  number;
    g_speed:    number;
    g_speedspread: number;

    fb_amount:  number;
    fb_position: number;
    fb_jitter:  number;

    len:       number;

    buffer:    AudioBuffer;
    duration:  number;
    stopped:   boolean;

    src:       AudioBufferSourceNode;
    envelope:  GainNode;
    panner:    StereoPannerNode;
    splitter:  ChannelSplitterNode;
    merge:     ChannelMergerNode;
    delayA:    DelayNode;
    delayB:    DelayNode;
    feedbackA: GainNode; 
    feedbackB: GainNode; 
    volume:    GainNode;

    constructor(audio: string, context: AudioContext, g_read: number, g_multiply: number = 1, g_fade: number = 1, g_spread: number = 20, g_scatter: number = 28) {

        this.g_read = g_read;
        this.g_multiply = g_multiply;
        this.g_fade = g_fade;
        this.g_spread = g_spread;
        this.g_scatter = (Math.random()*g_scatter)/127;

        this.fb_amount = 0;
        this.fb_position = 121;
        this.fb_jitter = 272;

        this.len = 12;

        this.audio = audio;
        this.context = context;
        this.buffer = null;
        this.duration = 0;
        this.stopped = true;

        this.src = this.context.createBufferSource();
        this.envelope = this.context.createGain();
        this.panner = this.context.createStereoPanner();

        this.splitter = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.5);
        this.delayB = this.context.createDelay(0.5);
        this.feedbackA = this.context.createGain();
        this.feedbackA.gain.value = 0.5;
        this.feedbackB = this.context.createGain();
        this.feedbackB.gain.value = 0.5;
        this.volume = this.context.createGain();

    }

    loadAudio() {
        return new Promise((resolve, reject) => {
            let that = this;
            let req = new XMLHttpRequest();

            req.open('GET', that.audio);
            req.responseType = 'arraybuffer';

            req.onload = () => {
                let audioData = req.response;

                this.context.decodeAudioData(audioData, buffer => {
                        this.src.buffer = buffer;
                        this.buffer = buffer;
                        this.duration = this.buffer.duration;
                        this.src.connect(this.envelope);

                        this.envelope.connect(this.delayA);
                        this.envelope.connect(this.delayB);
                        this.delayA.connect(this.feedbackA);
                        this.delayB.connect(this.feedbackB);
                        this.feedbackA.connect(this.delayA);
                        this.feedbackB.connect(this.delayB);
                        this.delayA.connect(this.merge, 0, 0);
                        this.delayB.connect(this.merge, 0, 1);

                        this._connectIfPanner([this.merge, this.panner]);
                        //this.merge.connect(this.panner);

                        this.src.loop = true;
                        //this.envelope.connect(this.panner);
                        this._connectIfPanner([this.panner,this.volume], [this.merge, this.volume]);
                        this.volume.connect(this.context.destination);
                        // this.forwardInTime();
                        // this.phasor();
                        return resolve({status: "success", message: ""});
                    },
                    e => reject({
                        status: "error",
                        message: "Error decoding audio data" + e
                    })
                );
            };

            req.onerror = err => reject({ status: "error", message: err });
            req.send();

        });
    }

    _connectIfPanner(a: any[], b:any=[]) {
        if (this.panner.empty !== true) {
            console.debug("connection panner");
            a[0].connect(a[1]);
        } else {
            console.debug("panner left out");
            if (b.length) { b[0].connect(b[1]); }
        }
    }

    restartAtTime(t: number) {
        console.log("restarting at time: ", t);
        this.stop();
        this.src = this.context.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.loop = true;
        this.src.connect(this.envelope);

        this.src.start(0, t);
        this.stopped = false;
    }

    play() {
        this.src.start(0);
        this.stopped = false;
    }

    start() {
        if (this.stopped) {
            this.restartAtTime(0);
            this.stopped = false;  // as a backup in case restartAtTime() fails... necessary?
        }
    }
    stop() {
        if (!this.stopped) {
            this.src.stop(0);
            this.stopped = true;
        }
    }

    set vol(v) {
        this.volume.gain.value = v;
    }
    get vol() {
        return this.volume.gain.value;
    }

    set delays(d) {
        this.delayA.delayTime.value = d;
    }
    get delays() {
        return this.delayA.delayTime.value;
    }

    set feedback(f) {
        this.feedbackA.gain.value = f;
    }
    get feedback() {
        return this.feedbackA.gain.value;
    }

    set position(x) {
        //console.log(this.src.loopStart);
        this.src.loopStart = x;
    }
    get position() {
        return this.src.loopStart;
    }
    set loopLength(x) {
        this.src.loopEnd = this.position + x;
    }
    get loopLength() {
        return this.src.loopEnd - this.src.loopStart;
    }

    toString() {
        return {"audio":this.audio,"context":this.context,"g_read":this.g_read, "g_speed": this.g_speed, "g_multiply":this.g_multiply, "g_fade": this.g_fade, "g_speedspread": this.g_speedspread, "g_spread": this.g_spread, "g_scatter":this.g_scatter};
    }

    set read(gr) {
        this.g_read = gr;
        this.readChanged.bind(this);
    }
    get read() {
        return this.g_read;
    }
    set speed(gs) {
        this.g_speed = gs;
    }
    get speed() {
        return this.g_speed;
    }

    set fade(gf) {
        this.g_fade = gf;
    }
    get fade() {
        return this.g_fade;
    }
    set speedspread(ss) {
        this.g_speedspread = ss;
    }
    get speedspread() {
        return this.g_speedspread;
    }
    set spread(gs) {
        this.g_spread = gs;
    }
    get spread() {
        return this.g_spread;
    }
    set scatter(gs) {
        //TODO: copied this from the constructor... should this scatter be different?
        //  should both scatters be different?  Check original Max/PD Patch!
        this.g_scatter = (Math.random()*gs)/127;
    }
    get scatter() {
        return this.g_scatter;
    }

    readChanged() {
        console.log("read changed.  pos: ", this.position);
        this.position = this.read * this.duration;
    }

    forwardInTime() {
        //console.log("forward!");
        // scope, I think?  this inside the callback should be this out here
        const internalCallback = () => {
            //return function(this) {
                this.position = this.position + 0.1;
                //console.log("moving forward.  pos: ", that.position);
                window.setTimeout(internalCallback.bind(this), 100);
            //}
        };
        window.setTimeout(internalCallback.bind(this), 100);
    }

    phasor() {
        let that = this;

        var internalCallback = () => {

            let time = ((Math.random() * this.read)*2 + 0.1);
            window.setTimeout(internalCallback.bind(this), time * 1000);

            if (this.stopped === false) {
                // Setting
                this.position = that.read * that.duration;
                //console.log("grain start position: ", that.position);
                this.loopLength = ((this.read * 29) + 6) * 50;  // based on each sample
                //console.log("grain length: ", that.loopLength);
                const pannerValue = (this.spread * 0.4 * Math.random()) - 1;
                this.panner.pan.setValueAtTime(pannerValue, this.context.currentTime);

                let now = this.context.currentTime;
                let e = this.envelope.gain;
                e.cancelScheduledValues(now);
                e.setValueAtTime(0.0001, now);

                this.restartAtTime(this.position);

                e.exponentialRampToValueAtTime(1, now + (time / 2));
                e.exponentialRampToValueAtTime(0.0001, now + time);

            }

        };
        //TODO: use AnimationFrame instead
        window.setTimeout(internalCallback.bind(this), 500);
    }

}
