'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Grainread class
 * a single grain for the playgrain class
 * Created by Mike Sperone on 8/25/16.
 *
 *
*/

var Grainread = function () {
    function Grainread(audio, context, g_read) {
        var g_multiply = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
        var g_fade = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];
        var g_spread = arguments.length <= 5 || arguments[5] === undefined ? 20 : arguments[5];
        var g_scatter = arguments.length <= 6 || arguments[6] === undefined ? 28 : arguments[6];

        _classCallCheck(this, Grainread);

        this.g_read = g_read;
        this.g_multiply = g_multiply;
        this.g_fade = g_fade;
        this.g_spread = g_spread;
        this.g_scatter = Math.random() * g_scatter / 127;

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

        this.split = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.2);
        this.delayB = this.context.createDelay(0.2);
        this.fbkA = this.context.createGain();
        this.fbkA.gain.value = 0.2;
        this.fbkB = this.context.createGain();
        this.fbkB.gain.value = 0.2;
        this.volume = this.context.createGain();

        var that = this;
        var req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function () {
            var audioData = req.response;

            that.context.decodeAudioData(audioData, function (buffer) {
                that.src.buffer = buffer;
                that.buffer = buffer;
                that.duration = that.buffer.duration;
                that.src.connect(that.env);

                // that.env.connect(that.split);
                // that.split.connect(that.delayA, 0);
                // that.split.connect(that.delayB, 1);
                // that.delayA.connect(that.fbkA);
                // that.delayB.connect(that.fbkB);
                // that.fbkA.connect(that.delayA);
                // that.fbkB.connect(that.delayB);
                // that.delayA.connect(that.merge, 0, 0);
                // that.delayB.connect(that.merge, 0, 1);
                //
                // that.merge.connect(that.panner);

                that.src.loop = true;
                that.env.connect(that.panner);
                that.panner.connect(that.volume);
                that.volume.connect(context.destination);
                that.phasor();
            }, function (e) {
                "Error with decoding audio data" + e.err;
            });
        };

        req.send();
    }

    _createClass(Grainread, [{
        key: 'restartAtTime',
        value: function restartAtTime(t) {
            this.stop();
            this.src = this.context.createBufferSource();
            this.src.buffer = this.buffer;
            this.src.loop = true;

            this.src.connect(this.env);

            this.src.start(0, t);
            this.stopped = false;
        }
    }, {
        key: 'play',
        value: function play() {
            this.src.start(0);
        }
    }, {
        key: 'start',
        value: function start() {
            if (this.stopped) {
                this.restartAtTime(0);
                this.stopped = false;
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (!this.stopped) {
                this.src.stop(0);
                this.stopped = true;
            }
        }
    }, {
        key: 'toString',
        value: function toString() {
            return [{ "audio": this.audio }, { "context": this.context }, { "g_read": this.g_read }, { "g_speed": this.g_speed }, { "g_multiply": this.g_multiply }, { "g_fade": this.g_fade }, { "g_speedspread": this.g_speedspread }, { "g_spread": this.g_spread }, { "g_scatter": this.g_scatter }];
        }
    }, {
        key: 'phasor',
        value: function phasor() {
            var that = this;

            var internalCallback = function () {

                return function () {

                    var time = Math.random() * that.read * 2 + 0.1;
                    window.setTimeout(internalCallback, time * 1000);

                    if (that.stopped === false) {

                        that.position = that.read * that.duration;
                        that.length = time;
                        that.panner.value = that.spread * 0.4 * Math.random() - 1;

                        var now = that.context.currentTime;
                        var e = that.env.gain;
                        e.cancelScheduledValues(now);
                        e.setValueAtTime(0.0001, now);

                        that.restartAtTime(that.position);

                        e.exponentialRampToValueAtTime(1, now + time / 2);
                        e.exponentialRampToValueAtTime(0.0001, now + time);
                    }
                };
            }();

            window.setTimeout(internalCallback, 500);
        }
    }, {
        key: 'vol',
        set: function set(v) {
            this.volume.gain.value = v;
        },
        get: function get() {
            return this.volume.gain.value;
        }
    }, {
        key: 'delays',
        set: function set(d) {
            this.delayA.delayTime.value = d;
        },
        get: function get() {
            return this.delayA.delayTime.value;
        }
    }, {
        key: 'feedback',
        set: function set(f) {
            this.fbkA.gain.value = f;
        },
        get: function get() {
            return this.fbkA.gain.value;
        }
    }, {
        key: 'position',
        set: function set(x) {
            this.src.loopStart = x;
        },
        get: function get() {
            return this.src.loopStart;
        }
    }, {
        key: 'length',
        set: function set(x) {
            this.src.loopEnd = this.position + x;
        },
        get: function get() {
            return this.src.loopEnd - this.src.loopStart;
        }
    }, {
        key: 'read',
        set: function set(gr) {
            this.g_read = gr;
        },
        get: function get() {
            return this.g_read;
        }
    }, {
        key: 'speed',
        set: function set(gs) {
            this.g_speed = gs;
        },
        get: function get() {
            return this.g_speed;
        }
    }, {
        key: 'fade',
        set: function set(gf) {
            this.g_fade = gf;
        },
        get: function get() {
            return this.g_fade;
        }
    }, {
        key: 'speedspread',
        set: function set(ss) {
            this.g_speedspread = ss;
        },
        get: function get() {
            return this.g_speedspread;
        }
    }, {
        key: 'spread',
        set: function set(gs) {
            this.g_spread = gs;
        },
        get: function get() {
            return this.g_spread;
        }
    }, {
        key: 'scatter',
        set: function set(gs) {
            this.g_scatter = gs;
        },
        get: function get() {
            return this.g_scatter;
        }
    }]);

    return Grainread;
}();

//# sourceMappingURL=grainread.js.map