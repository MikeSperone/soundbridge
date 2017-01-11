"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Mike on 9/2/16.
 */

var Loop = function (_Play) {
    _inherits(Loop, _Play);

    function Loop(audio, context, connection) {
        _classCallCheck(this, Loop);

        var _this = _possibleConstructorReturn(this, (Loop.__proto__ || Object.getPrototypeOf(Loop)).call(this, audio, context, connection));

        _this.audio = audio;
        _this.context = context;
        _this.connect = connection;
        _this.position = 0;
        _this.sensorPos = null;
        //this.play();
        return _this;
    }

    _createClass(Loop, [{
        key: "sensor",
        value: function sensor(val) {
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


            var x = Math.floor(val);

            if (x > 20) {

                if (x !== this.sensorPos) {
                    this.sensorPos = x;
                    this.loop(x);
                }
            } else if (x < 11) {
                // play
                this.position = 0;
                this.length = this.duration;
                this.startSample(time);
            }
        }
    }, {
        key: "loop",
        value: function loop(x) {
            var start = void 0;
            var dur = this.duration;
            this.stop();
            switch (x) {
                case 21:
                case 22:
                    start = 0.3 * dur;
                    break;
                case 23:
                case 24:
                    start = 0.4 * dur;
                    break;
                case 25:
                case 26:
                    start = 0.5 * dur;
                    break;
                case 27:
                case 28:
                    start = 0.6 * dur;
                    break;
                case 29:
                case 30:
                    start = 0.7 * dur;
                    break;
                case 31:
                case 32:
                    start = 0.8 * dur;
                    break;
                default:
                    start = 0.9 * dur;
                    break;
            }
            console.log("start: " + start);
            this.position = start;
            this.length = 1.2;
            this.startSample(this.position);
        }
    }, {
        key: "delaySwitch",
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
    }]);

    return Loop;
}(Play);