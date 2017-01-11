/**
 * Grainread class
 * a single grain for the playgrain class
 * Created by Mike Sperone on 8/25/16.
 *
 *
*/

class Grainread {

    constructor(audio, context, connection, g_read, g_multiply = 1, g_fade = 1, g_spread = 20, g_scatter = 28) {
        //console.log("grainread");

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
        this.connect = connection;
        this.buffer = null;
        this.duration = null;
        this.stopped = true;

        this.src = this.context.createBufferSource();
        this.env = this.context.createGain();
        this.panner = this.context.createStereoPanner();

        this.split = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.5);
        this.delayB = this.context.createDelay(0.5);
        this.fbkA = this.context.createGain();
        this.fbkA.gain.value = 0.2;
        this.fbkB = this.context.createGain();
        this.fbkB.gain.value = 0.2;
        this.volume = this.context.createGain();

        let that = this;
        let req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function() {
            let audioData = req.response;

            that.context.decodeAudioData(audioData, function(buffer) {
                    //console.log("decode audio data");
                    that.src.buffer = buffer;
                    that.buffer = buffer;
                    that.duration = that.buffer.duration;
                    that.src.connect(that.env);

                    that.env.connect(that.split);
                    that.split.connect(that.delayA, 0);
                    that.split.connect(that.delayB, 1);
                    that.delayA.connect(that.fbkA);
                    that.delayB.connect(that.fbkB);
                    that.fbkA.connect(that.delayA);
                    that.fbkB.connect(that.delayB);
                    that.delayA.connect(that.merge, 0, 0);
                    that.delayB.connect(that.merge, 0, 1);

                    that.merge.connect(that.panner);

                    that.delayA.delayTime.value = Math.random()*0.5;
                    that.delayB.delayTime.value = Math.random()*0.5;
                    that.src.loop = true;
                    that.env.connect(that.panner);
                    that.panner.connect(that.volume);
                    that.volume.connect(that.connect);
                    that.phasor();
                },
                function(e){"Error with decoding audio data" + e.err});
        };

        req.send();

    }

    restartAtTime(t) {
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
        this.fbkA.gain.value = Math.random()*f;
    }
    get feedback() {
        return this.fbkA.gain.value;
    }

    set position(x) {
        this.src.loopStart = x;
    }
    get position() {
        return this.src.loopStart;
    }
    set length(x) {
        this.src.loopEnd = this.position + x;
    }
    get length() {
        return this.src.loopEnd - this.src.loopStart;
    }

    toString() {
        return [{"audio":this.audio},{"context":this.context},{"g_read":this.g_read}, {"g_speed": this.g_speed}, {"g_multiply":this.g_multiply}, {"g_fade": this.g_fade}, {"g_speedspread": this.g_speedspread}, {"g_spread": this.g_spread}, {"g_scatter":this.g_scatter}];
    }

    set read(gr) {
        this.g_read = gr;
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

    phasor() {
        let that = this;
        //console.log(that, ", phasor");
        var internalCallback = function() {

            return function() {

                this.time = ((Math.random() * that.read)*2 + 0.1);
                //console.log(this, ", time: ", time);
                window.setTimeout(internalCallback, this.time * 1000);

                if (that.stopped === false) {

                    that.position = that.read * that.duration;
                    that.length = this.time;
                    that.panner.value = (that.spread * 0.4 * Math.random()) - 1;

                    this.now = that.context.currentTime;
                    this.e = that.env.gain;
                    this.e.cancelScheduledValues(this.now);
                    this.e.setValueAtTime(0.0001, this.now);

                    that.restartAtTime(that.position);

                    this.e.exponentialRampToValueAtTime(1, this.now + this.time / 2);
                    this.e.exponentialRampToValueAtTime(0.0001, this.now + this.time);

                }

            };
        }();

        window.setTimeout(internalCallback, 500);
    }

}
