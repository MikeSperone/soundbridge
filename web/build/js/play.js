'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Mike on 8/30/16.
 */

var Play = function () {
    function Play(audio, context) {
        _classCallCheck(this, Play);

        this.audio = audio;
        this.context = context;

        this.buffer = null;
        this.loopStart = 0;
        this.loopEnd = 0;

        var that = this;
        var req = new XMLHttpRequest();

        req.open('GET', audio);
        req.responseType = 'arraybuffer';

        req.onload = function () {
            var audioData = req.response;

            that.context.decodeAudioData(audioData, function (buffer) {
                that.buffer = buffer;
                that.startSample();
                that.volume.gain.value = 0;
            }, function (e) {
                console.log("Error with decoding audio data" + e.err);
            });
        };

        req.send();
    }

    _createClass(Play, [{
        key: 'startSample',
        value: function startSample(offset) {

            this.src = this.context.createBufferSource();
            this.volume = this.context.createGain();
            this.src.buffer = this.buffer;

            this.src.loop = true;
            this.src.loopStart = this.loopStart;
            this.src.loopEnd = this.loopEnd;

            this.src.connect(this.volume);
            this.volume.connect(this.context.destination);
            //this.volume.gain.value = 0;
            this.src.start(0, offset);
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
            this.src.stop(0);
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
        key: 'position',
        set: function set(x) {
            this.loopStart = x;
            console.log("loop start: " + this.loopStart);
        },
        get: function get() {
            return this.loopStart;
        }
    }, {
        key: 'length',
        set: function set(x) {
            this.loopEnd = Math.min(this.position + x, this.duration);
            console.log("loop end: " + this.loopEnd);
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

//# sourceMappingURL=play.js.map