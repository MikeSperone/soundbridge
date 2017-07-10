/**
 * Grainread class
 * a single series of grains
  for the playgrain class
 * Created by Mike Sperone on 8/25/16.
 *
*/

export default class Grainread {

    constructor(audio, context, g_read, g_multiply = 1, g_fade = 1, g_spread = 20, g_scatter = 28) {

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
        this.duration = null;
        this.stopped = true;

        this.src = this.context.createBufferSource();
        this.env = this.context.createGain();
        this.panner = this.context.createStereoPanner();

        this.splitter = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.5);
        this.delayB = this.context.createDelay(0.5);
        this.fbkA = this.context.createGain();
        this.fbkA.gain.value = 0.5;
        this.fbkB = this.context.createGain();
        this.fbkB.gain.value = 0.5;
        this.volume = this.context.createGain();

        let that = this;
        let req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function() {
            let audioData = req.response;

            that.context.decodeAudioData(audioData, function(buffer) {
                    that.src.buffer = buffer;
                    that.buffer = buffer;
                    that.duration = that.buffer.duration;
                    that.src.connect(that.env);

                    that.env.connect(that.delayA);
                    that.env.connect(that.delayB);
                    that.delayA.connect(that.fbkA);
                    that.delayB.connect(that.fbkB);
                    that.fbkA.connect(that.delayA);
                    that.fbkB.connect(that.delayB);
                    that.delayA.connect(that.merge, 0, 0);
                    that.delayB.connect(that.merge, 0, 1);

                    that._connectIfPanner([that.merge, that.panner]);
                    //that.merge.connect(that.panner);

                    that.src.loop = true;
                    //that.env.connect(that.panner);
                    that._connectIfPanner([that.panner,that.volume], [that.merge, that.volume]);
                    that.volume.connect(context.destination);
                    that.forwardInTime();
                    that.phasor();
                },
                function(e){"Error with decoding audio data" + e.err});
        };

        req.send();

    }

    _connectIfPanner(a, b=[]) {
        if (this.panner.empty !== true) {
            //console.debug("connection panner");
            a[0].connect(a[1]);
        } else {
            //console.debug("panner left out");
            if (b.length) { b[0].connect(b[1]); }
        }
    }
    restartAtTime(t) {
        console.log("restarting at time: ", t);
        this.stop();
        this.src = this.context.createBufferSource();
        this.src.buffer = this.buffer;
        this.src.loop = true;

        this.src.connect(this.env);

        this.src.start(0, t);
        this.stopped = false;
    }

    play() {
        this.src.start(0);
    }

    start() {
        if (this.stopped) {
            this.restartAtTime(0);
            this.stopped = false;
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
        this.fbkA.gain.value = f;
    }
    get feedback() {
        return this.fbkA.gain.value;
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
        return [{"audio":this.audio},{"context":this.context},{"g_read":this.g_read}, {"g_speed": this.g_speed}, {"g_multiply":this.g_multiply}, {"g_fade": this.g_fade}, {"g_speedspread": this.g_speedspread}, {"g_spread": this.g_spread}, {"g_scatter":this.g_scatter}];
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
        this.g_scatter = gs;
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
        const internalCallback = function() {
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

        var internalCallback = function() {

            //return function() {

                let time = ((Math.random() * this.read)*2 + 0.1);
                window.setTimeout(internalCallback.bind(this), time * 1000);

                if (this.stopped === false) {
                    // Setting
                    //that.position = that.read * that.duration;
                    //console.log("grain start position: ", that.position);
                    this.loopLength = ((this.read * 29) + 6) * 50;  // based on each sample
                    //console.log("grain length: ", that.loopLength);
                    this.panner.value = (this.spread * 0.4 * Math.random()) - 1;

                    let now = this.context.currentTime;
                    let e = this.env.gain;
                    e.cancelScheduledValues(now);
                    e.setValueAtTime(0.0001, now);

                    this.restartAtTime(this.position);

                    e.exponentialRampToValueAtTime(1, now + (time / 2));
                    e.exponentialRampToValueAtTime(0.0001, now + time);

                }

            //};

        }();
        //TODO: use AnimationFrame instead
        window.setTimeout(internalCallback.bind(this), 500);
    }

}
