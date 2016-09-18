/**
 * Created by Mike on 8/25/16.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playgroove = function () {
    function Playgroove(audio, context) {
        _classCallCheck(this, Playgroove);

        this.audio = audio;
        this.context = context;
        this.src = this.context.createBufferSource();
        this.delay = this.context.createDelay(1.0);
        this.feedback = this.context.createGain();
        this.volume = this.context.createGain();

        this.merge = this.context.createChannelMerger(2);
        this.panL = this.context.createStereoPanner();
        this.panL.pan.value = -1;

        this.merge.connect(this.volume);

        var that = this;

        var req = new XMLHttpRequest();
        req.open('GET', this.audio);
        req.responseType = 'arraybuffer';

        req.onload = function () {
            this.audioData = req.response;

            context.decodeAudioData(this.audioData, function (buffer) {

                that.src.buffer = buffer;
                that.src.playbackRate.value = 1;

                that.volume.connect(context.destination);
                that.volume.gain.value = 0;
                that.src.loop = true;
            }, function (e) {
                console.log("Error with decoding audio data " + e.err);
            });
        };

        req.send();
        this.src.start(0);
    }

    _createClass(Playgroove, [{
        key: 'toString',
        value: function toString() {
            return [{ "audio": this.audio }, { "context": this.context }, { "delayTime": this.delay.delayTime.value }, { "delayFeedback": this.feedback.gain.value }, { "rate": this.src.playbackRate.value }, { "volume": this.volume.gain.value }];
        }
    }, {
        key: 'delaySwitch',
        value: function delaySwitch(setting) {
            if (setting) {
                //console.log("delay on");
                this.delay.connect(this.feedback);
                this.feedback.connect(this.delay);
                this.delay.connect(this.merge, 0, 1);
                this.src.connect(this.panL);
                this.src.connect(this.delay);
                this.panL.connect(this.volume);
            } else {
                //console.log("delay off");
                this.src.connect(this.volume);
            }
        }
    }, {
        key: 'delTime',
        value: function delTime(time) {
            this.delay.delayTime.value = time;
        }
    }, {
        key: 'delFeedback',
        value: function delFeedback(fbk) {
            this.feedback.gain.value = fbk;
        }
    }, {
        key: 'pbRate',
        value: function pbRate(rate) {
            this.src.playbackRate.value = rate;
        }
    }, {
        key: 'vol',
        value: function vol(v) {
            this.volume.gain.value = v;
        }
    }]);

    return Playgroove;
}();

//# sourceMappingURL=playgroove.js.map