'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Mike on 8/30/16.
 */

var Play = function () {
    function Play(audio, context) {
        var vol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, Play);

        this.audio = audio;
        this.context = context;
        this.contextCreationTime = new Date();
        this.startTime = null;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.stopped = true;

        var that = this;
        var req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function () {
            var audioData = req.response;

            that.context.decodeAudioData(audioData, function (buffer) {
                that.buffer = buffer;
                that.stopped = true;
                that.startSample();
                that.volume.gain.value = vol;
                that.audioLoadTimeOffset = (new Date() - that.contextCreationTime) / 1000;
            }, function (e) {
                console.log("Error with decoding audio data" + e.err);
            });
        };

        req.send();
    }

    _createClass(Play, [{
        key: 'startSample',
        value: function startSample() {
            var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            console.log("startSample");

            offset = offset < 0 ? 0 : offset;
            if (this.stopped === false) {
                this.stop();
            }
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
    }, {
        key: 'play',
        value: function play() {
            if (this.src) {
                this.src.start();
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.stopped === false) {
                this.src.stop(0);
                this.stopped = true;
            }
        }
    }, {
        key: 'toString',
        value: function toString() {
            return [{ "audio": this.audio }, { "context": this.context }];
        }
    }, {
        key: 'duration',
        get: function get() {
            return this.src.buffer.duration;
        }
    }, {
        key: 'elapsedTime',
        get: function get() {
            return this.context.currentTime - this.startTime;
        }
    }, {
        key: 'position',
        set: function set(x) {
            this.loopStart = x;
        },
        get: function get() {
            return this.loopStart;
        }
    }, {
        key: 'length',
        set: function set(x) {
            this.loopEnd = Math.min(this.position + x, this.duration);
        },
        get: function get() {
            return this.src.loopEnd - this.src.loopStart;
        }
    }, {
        key: 'vol',
        set: function set(v) {
            this.volume.gain.value = v;
        }
    }]);

    return Play;
}();