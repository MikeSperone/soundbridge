"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Mike on 9/2/16.
 */

var Trigroove = function (_Play) {
    _inherits(Trigroove, _Play);

    function Trigroove(audio, context) {
        _classCallCheck(this, Trigroove);

        var _this = _possibleConstructorReturn(this, (Trigroove.__proto__ || Object.getPrototypeOf(Trigroove)).call(this, audio, context));

        _this.audio = audio;
        _this.context = context;
        _this.position = 0;
        //this.length = 1.2; //s
        _this.play();
        return _this;
    }

    _createClass(Trigroove, [{
        key: "sensor",
        value: function sensor(val) {
            var x = Math.floor(val);

            if (x > 20) {
                if (x != y) {
                    var _y = x;
                    this.loop(x);
                }
            } else if (x > 11) {
                this.hold(x);
            } else {
                // play
                this.position = 0;
                this.length = this.duration;
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
            this.stop();
            this.startSample();
        }
    }, {
        key: "hold",
        value: function hold(x) {
            //uhhhhh....
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

    return Trigroove;
}(Play);

//# sourceMappingURL=trigroove.js.map