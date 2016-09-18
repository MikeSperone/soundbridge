/**
* Created by Mike on 8/25/16.
*/
"use strict";
class Grainread {

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
        this.src = this.context.createBufferSource();
        this.env = this.context.createGain();
        this.split = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.2);
        this.delayB = this.context.createDelay(0.2);
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
                    that.src.buffer = buffer;
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
                    that.src.loop = true;
                    that.merge.connect(that.volume);
                    that.volume.connect(context.destination);
                    that.volume.gain.value = 0;
                },
                function(e){"Error with decoding audio data" + e.err});
        };

        req.send();
        this.play();
    }

    play() {
        this.src.start(0);
    }

    set vol(v) {
        this.volume.gain.value = v;
    }

    set delays(d) {
        this.delayA.delayTime.value = d;
    }

    set feedback(f) {
        this.fbkA.gain.value = f;
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

    onPhasor(t, time) {
        "use strict";

        // bottom right of GRAINREAD_Five
        t.position = time;
        t.length = t.g_read;
        let now = t.context.currentTime;
        let e = t.env.gain;
        e.cancelScheduledValues(now);
        e.setValueAtTime(0, now);
        e.linearRampToValueAtTime(1, now + time/2);
        e.linearRampToValueAtTime(0, now + time);
        //console.log("enveloped");
        //console.log(time + ", " + t.g_read);
    }

    phasor() {
        let that = this;

        var internalCallback = function() {
            return function() {
                    let time = (500/Math.random()) + 100;
                    window.setTimeout(internalCallback, time);
                    that.onPhasor(that, time/1000);
                };
        }();

        window.setTimeout(internalCallback, 500);
    }

}

function noise(spread) {
    "use strict";
    var noise = Math.random()*spread*20000;
    return noise * noise;
}