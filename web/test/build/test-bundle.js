/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Grainread class
 * a single series of grains
  for the playgrain class
 * Created by Mike Sperone on 8/25/16.
 *
*/
var Grainread = function () {
    function Grainread(audio, context, g_read) {
        var g_multiply = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var g_fade = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var g_spread = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;
        var g_scatter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 28;

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

        this.splitter = this.context.createChannelSplitter(2);
        this.merge = this.context.createChannelMerger(2);
        this.delayA = this.context.createDelay(0.5);
        this.delayB = this.context.createDelay(0.5);
        this.fbkA = this.context.createGain();
        this.fbkA.gain.value = 0.5;
        this.fbkB = this.context.createGain();
        this.fbkB.gain.value = 0.5;
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
                that._connectIfPanner([that.panner, that.volume], [that.merge, that.volume]);
                that.volume.connect(context.destination);
                that.forwardInTime();
                that.phasor();
            }, function (e) {
                "Error with decoding audio data" + e.err;
            });
        };

        req.send();
    }

    _createClass(Grainread, [{
        key: '_connectIfPanner',
        value: function _connectIfPanner(a) {
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (this.panner.empty !== true) {
                console.debug("connection panner");
                a[0].connect(a[1]);
            } else {
                console.debug("panner left out");
                if (b.length) {
                    b[0].connect(b[1]);
                }
            }
        }
    }, {
        key: 'restartAtTime',
        value: function restartAtTime(t) {
            console.log("restarting at time: ", t);
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
            this.stopped = false;
        }
    }, {
        key: 'start',
        value: function start() {
            if (this.stopped) {
                this.restartAtTime(0);
                this.stopped = false; // as a backup in case restartAtTime() fails... necessary?
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
            return { "audio": this.audio, "context": this.context, "g_read": this.g_read, "g_speed": this.g_speed, "g_multiply": this.g_multiply, "g_fade": this.g_fade, "g_speedspread": this.g_speedspread, "g_spread": this.g_spread, "g_scatter": this.g_scatter };
        }
    }, {
        key: 'readChanged',
        value: function readChanged() {
            console.log("read changed.  pos: ", this.position);
            this.position = this.read * this.duration;
        }
    }, {
        key: 'forwardInTime',
        value: function forwardInTime() {
            //console.log("forward!");
            // scope, I think?  this inside the callback should be this out here
            var internalCallback = function internalCallback() {
                //return function(this) {
                this.position = this.position + 0.1;
                //console.log("moving forward.  pos: ", that.position);
                window.setTimeout(internalCallback.bind(this), 100);
                //}
            };
            window.setTimeout(internalCallback.bind(this), 100);
        }
    }, {
        key: 'phasor',
        value: function phasor() {
            var _this = this;

            var that = this;

            var internalCallback = function internalCallback() {

                var time = Math.random() * _this.read * 2 + 0.1;
                window.setTimeout(internalCallback.bind(_this), time * 1000);

                if (_this.stopped === false) {
                    // Setting
                    _this.position = that.read * that.duration;
                    //console.log("grain start position: ", that.position);
                    _this.loopLength = (_this.read * 29 + 6) * 50; // based on each sample
                    //console.log("grain length: ", that.loopLength);
                    _this.panner.value = _this.spread * 0.4 * Math.random() - 1;

                    var now = _this.context.currentTime;
                    var e = _this.env.gain;
                    e.cancelScheduledValues(now);
                    e.setValueAtTime(0.0001, now);

                    _this.restartAtTime(_this.position);

                    e.exponentialRampToValueAtTime(1, now + time / 2);
                    e.exponentialRampToValueAtTime(0.0001, now + time);
                }
            };
            //TODO: use AnimationFrame instead
            window.setTimeout(internalCallback.bind(this), 500);
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
            //console.log(this.src.loopStart);
            this.src.loopStart = x;
        },
        get: function get() {
            return this.src.loopStart;
        }
    }, {
        key: 'loopLength',
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
            this.readChanged.bind(this);
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
            //TODO: copied this from the constructor... should this scatter be different?
            //  should both scatters be different?  Check original Max/PD Patch!
            this.g_scatter = Math.random() * gs / 127;
        },
        get: function get() {
            return this.g_scatter;
        }
    }]);

    return Grainread;
}();

exports.default = Grainread;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Mike on 8/30/16.
 */

var Play = function () {
    /**
     * Plays an audio file
     * @param {string} audio - path to audio file
     * @param {AudioContext} context - Web Audio Context
     * @param {number} vol - (optional) The starting volume.  Defaults to 0
     */
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

        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                var audioData = req.response;

                that.context.decodeAudioData(audioData, function (buffer) {
                    that.buffer = buffer;
                    that.stopped = true;
                    that.startSample();
                    that.volume.gain.value = vol;
                    that.audioLoadTimeOffset = (new Date() - that.contextCreationTime) / 1000;
                    // console.log(that);
                }, function (e) {
                    console.log("Error with decoding audio data" + e.err);
                });
            }
        };

        req.send();
    }

    /**
     * Start playing the sample at new offset
     * @param {number} offset - How far into the sample to start playback (s)
     */


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

        /**
         * Get the duration of the audio buffer
         * @return {number} The duration in ms
         */

    }, {
        key: 'play',
        value: function play() {
            if (this.src) {
                this.src.start();
            }
        }

        /**
         * Stop the audio
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.stopped === false) {
                this.src.stop(0);
                this.stopped = true;
            }
        }

        /**
         * Gets the elapsed time from start of playback
         * @return time from start of playback until now (ms)
         */

    }, {
        key: 'toString',
        value: function toString() {
            return [{ "audio": this.audio }, { "context": this.context }];
        }

        /**
         * Set the volume
         * @param {number} v 0.0 to 1.0
         */

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
        key: 'len',
        set: function set(x) {
            this.loopEnd = Math.min(this.position + x, this.duration);
            this.startSample();
        },
        get: function get() {
            return this.src.loopEnd - this.src.loopStart;
        }
    }, {
        key: 'vol',
        set: function set(v) {
            this.volume.gain.value = v;
        }

        /**
         * Get the current volume
         * @return {Number} volume
         */
        ,
        get: function get() {
            return this.volume.gain.value;
        }
    }]);

    return Play;
}();

exports.default = Play;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _play = __webpack_require__(1);

var _play2 = _interopRequireDefault(_play);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Mike on 9/2/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Loop = function (_Play) {
    _inherits(Loop, _Play);

    function Loop(audio, context) {
        _classCallCheck(this, Loop);

        var _this = _possibleConstructorReturn(this, (Loop.__proto__ || Object.getPrototypeOf(Loop)).call(this, audio, context));

        _this.audio = audio;
        _this.context = context;
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
                    if (x > 32) {
                        start = 0.9 * dur;
                    } else if (x < 21) {
                        start = 0.3 * dur;
                    }
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
}(_play2.default);

exports.default = Loop;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Playgrain class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Mike on 9/1/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _grainread = __webpack_require__(0);

var _grainread2 = _interopRequireDefault(_grainread);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playgrain = function () {
    function Playgrain(audio, context) {
        _classCallCheck(this, Playgrain);

        this.audio = audio;
        this.context = context;

        this.a = new _grainread2.default(this.audio, this.context, 1);
        this.b = new _grainread2.default(this.audio, this.context, 1);
        this.c = new _grainread2.default(this.audio, this.context, 1);
        this.d = new _grainread2.default(this.audio, this.context, 1);
        this.e = new _grainread2.default(this.audio, this.context, 1);
        this.f = new _grainread2.default(this.audio, this.context, 1);
        this.g = new _grainread2.default(this.audio, this.context, 1);
        this.h = new _grainread2.default(this.audio, this.context, 1);
        this.i = new _grainread2.default(this.audio, this.context, 1);
        this.j = new _grainread2.default(this.audio, this.context, 1);
    }

    /**
     * Sets the fade
     *
     *
     */


    _createClass(Playgrain, [{
        key: 'start',


        /**
         *  Starts playing
         */
        value: function start() {
            this.a.start();
            this.b.start();
            this.c.start();
            this.d.start();
            this.e.start();
            this.f.start();
            this.g.start();
            this.h.start();
            this.i.start();
            this.j.start();
        }

        /**
         * Stops playing
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.a.stop();
            this.b.stop();
            this.c.stop();
            this.d.stop();
            this.e.stop();
            this.f.stop();
            this.g.stop();
            this.h.stop();
            this.i.stop();
            this.j.stop();
        }

        /**
         * Sets the volume
         */

    }, {
        key: 'fade',
        set: function set(f) {
            this.a.fade = f;
            this.b.fade = f;
            this.c.fade = f;
            this.d.fade = f;
            this.e.fade = f;
            this.f.fade = f;
            this.g.fade = f;
            this.h.fade = f;
            this.i.fade = f;
            this.j.fade = f;
        }

        /**
         * Sets the delay feedback
         */

    }, {
        key: 'feedback',
        set: function set(f) {
            this.a.feedback = f;
            this.b.feedback = f;
            this.c.feedback = f;
            this.d.feedback = f;
            this.e.feedback = f;
            this.f.feedback = f;
            this.g.feedback = f;
            this.h.feedback = f;
            this.i.feedback = f;
            this.j.feedback = f;
        }

        /**
         * Sets the read point
         */

    }, {
        key: 'read',
        set: function set(gr) {
            this.a.read = gr;
            this.b.read = gr;
            this.c.read = gr;
            this.d.read = gr;
            this.e.read = gr;
            this.f.read = gr;
            this.g.read = gr;
            this.h.read = gr;
            this.i.read = gr;
            this.j.read = gr;
        }

        /**
         * Sets the grain scatter amount
         */

    }, {
        key: 'scatter',
        set: function set(s) {
            this.a.scatter = s;
            this.b.scatter = s;
            this.c.scatter = s;
            this.d.scatter = s;
            this.e.scatter = s;
            this.f.scatter = s;
            this.g.scatter = s;
            this.h.scatter = s;
            this.i.scatter = s;
            this.j.scatter = s;
        }

        /**
         * Sets the grain spread
         */

    }, {
        key: 'spread',
        set: function set(s) {
            this.a.spread = s;
            this.b.spread = s;
            this.c.spread = s;
            this.d.spread = s;
            this.e.spread = s;
            this.f.spread = s;
            this.g.spread = s;
            this.h.spread = s;
            this.i.spread = s;
            this.j.spread = s;
        }
    }, {
        key: 'vol',
        set: function set(v) {
            this.a.vol = v;
            this.b.vol = v;
            this.c.vol = v;
            this.d.vol = v;
            this.e.vol = v;
            this.f.vol = v;
            this.g.vol = v;
            this.h.vol = v;
            this.i.vol = v;
            this.j.vol = v;
        }
    }]);

    return Playgrain;
}();

exports.default = Playgrain;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Mike on 8/25/16.
 */


Object.defineProperty(exports, "__esModule", {
    value: true
});

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
        key: 'delaySwitch',
        value: function delaySwitch(setting) {
            if (setting) {
                console.debug("delay on");
                this.delay.connect(this.feedback);
                this.feedback.connect(this.delay);
                if (this.panL.empty !== true) {
                    console.debug("connection panL");
                    this.delay.connect(this.merge, 0, 1);
                    this.src.connect(this.panL);
                    this.src.connect(this.delay);
                    this.panL.connect(this.volume);
                } else {
                    console.debug("panL left out");
                    this.delay.connect(this.merge, 0, 1);
                    this.src.connect(this.merge, 0, 0);
                    this.merge.connect(this.volume);
                }
            } else {
                this.src.connect(this.volume);
            }
        }
    }, {
        key: '_restrict',
        value: function _restrict(val) {
            if (val < 0) val = 0;
            if (val > 1) val = 1;
            return val;
        }
    }, {
        key: 'delTime',
        value: function delTime(time) {
            this.delay.delayTime.value = this._restrict(time);
        }
    }, {
        key: 'delFeedback',
        value: function delFeedback(fbk) {
            this.feedback.gain.value = this._restrict(fbk);
        }
    }, {
        key: 'pbRate',
        value: function pbRate(rate) {
            this.src.playbackRate.value = this._restrict(rate);
        }
    }, {
        key: 'vol',
        value: function vol(v) {
            this.volume.gain.value = this._restrict(v);
        }
    }]);

    return Playgroove;
}();

exports.default = Playgroove;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-invalid-this */
let checkError = __webpack_require__(7);

module.exports = (chai, utils) => {
    const Assertion = chai.Assertion;
    const assert = chai.assert;
    const proxify = utils.proxify;

    // If we are using a version of Chai that has checkError on it,
    // we want to use that version to be consistent. Otherwise, we use
    // what was passed to the factory.
    if (utils.checkError) {
        checkError = utils.checkError;
    }

    function isLegacyJQueryPromise(thenable) {
        // jQuery promises are Promises/A+-compatible since 3.0.0. jQuery 3.0.0 is also the first version
        // to define the catch method.
        return typeof thenable.catch !== "function" &&
               typeof thenable.always === "function" &&
               typeof thenable.done === "function" &&
               typeof thenable.fail === "function" &&
               typeof thenable.pipe === "function" &&
               typeof thenable.progress === "function" &&
               typeof thenable.state === "function";
    }

    function assertIsAboutPromise(assertion) {
        if (typeof assertion._obj.then !== "function") {
            throw new TypeError(utils.inspect(assertion._obj) + " is not a thenable.");
        }
        if (isLegacyJQueryPromise(assertion._obj)) {
            throw new TypeError("Chai as Promised is incompatible with thenables of jQuery<3.0.0, sorry! Please " +
                                "upgrade jQuery or use another Promises/A+ compatible library (see " +
                                "http://promisesaplus.com/).");
        }
    }

    function proxifyIfSupported(assertion) {
        return proxify === undefined ? assertion : proxify(assertion);
    }

    function method(name, asserter) {
        utils.addMethod(Assertion.prototype, name, function () {
            assertIsAboutPromise(this);
            return asserter.apply(this, arguments);
        });
    }

    function property(name, asserter) {
        utils.addProperty(Assertion.prototype, name, function () {
            assertIsAboutPromise(this);
            return proxifyIfSupported(asserter.apply(this, arguments));
        });
    }

    function doNotify(promise, done) {
        promise.then(() => done(), done);
    }

    // These are for clarity and to bypass Chai refusing to allow `undefined` as actual when used with `assert`.
    function assertIfNegated(assertion, message, extra) {
        assertion.assert(true, null, message, extra.expected, extra.actual);
    }

    function assertIfNotNegated(assertion, message, extra) {
        assertion.assert(false, message, null, extra.expected, extra.actual);
    }

    function getBasePromise(assertion) {
        // We need to chain subsequent asserters on top of ones in the chain already (consider
        // `eventually.have.property("foo").that.equals("bar")`), only running them after the existing ones pass.
        // So the first base-promise is `assertion._obj`, but after that we use the assertions themselves, i.e.
        // previously derived promises, to chain off of.
        return typeof assertion.then === "function" ? assertion : assertion._obj;
    }

    function getReasonName(reason) {
        return reason instanceof Error ? reason.toString() : checkError.getConstructorName(reason);
    }

    // Grab these first, before we modify `Assertion.prototype`.

    const propertyNames = Object.getOwnPropertyNames(Assertion.prototype);

    const propertyDescs = {};
    for (const name of propertyNames) {
        propertyDescs[name] = Object.getOwnPropertyDescriptor(Assertion.prototype, name);
    }

    property("fulfilled", function () {
        const derivedPromise = getBasePromise(this).then(
            value => {
                assertIfNegated(this,
                                "expected promise not to be fulfilled but it was fulfilled with #{act}",
                                { actual: value });
                return value;
            },
            reason => {
                assertIfNotNegated(this,
                                   "expected promise to be fulfilled but it was rejected with #{act}",
                                   { actual: getReasonName(reason) });
                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    property("rejected", function () {
        const derivedPromise = getBasePromise(this).then(
            value => {
                assertIfNotNegated(this,
                                   "expected promise to be rejected but it was fulfilled with #{act}",
                                   { actual: value });
                return value;
            },
            reason => {
                assertIfNegated(this,
                                "expected promise not to be rejected but it was rejected with #{act}",
                                { actual: getReasonName(reason) });

                // Return the reason, transforming this into a fulfillment, to allow further assertions, e.g.
                // `promise.should.be.rejected.and.eventually.equal("reason")`.
                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    method("rejectedWith", function (errorLike, errMsgMatcher, message) {
        let errorLikeName = null;
        const negate = utils.flag(this, "negate") || false;

        // rejectedWith with that is called without arguments is
        // the same as a plain ".rejected" use.
        if (errorLike === undefined && errMsgMatcher === undefined &&
            message === undefined) {
            /* eslint-disable no-unused-expressions */
            return this.rejected;
            /* eslint-enable no-unused-expressions */
        }

        if (message !== undefined) {
            utils.flag(this, "message", message);
        }

        if (errorLike instanceof RegExp || typeof errorLike === "string") {
            errMsgMatcher = errorLike;
            errorLike = null;
        } else if (errorLike && errorLike instanceof Error) {
            errorLikeName = errorLike.toString();
        } else if (typeof errorLike === "function") {
            errorLikeName = checkError.getConstructorName(errorLike);
        } else {
            errorLike = null;
        }
        const everyArgIsDefined = Boolean(errorLike && errMsgMatcher);

        let matcherRelation = "including";
        if (errMsgMatcher instanceof RegExp) {
            matcherRelation = "matching";
        }

        const derivedPromise = getBasePromise(this).then(
            value => {
                let assertionMessage = null;
                let expected = null;

                if (errorLike) {
                    assertionMessage = "expected promise to be rejected with #{exp} but it was fulfilled with #{act}";
                    expected = errorLikeName;
                } else if (errMsgMatcher) {
                    assertionMessage = `expected promise to be rejected with an error ${matcherRelation} #{exp} but ` +
                                       `it was fulfilled with #{act}`;
                    expected = errMsgMatcher;
                }

                assertIfNotNegated(this, assertionMessage, { expected, actual: value });
                return value;
            },
            reason => {
                const errorLikeCompatible = errorLike && (errorLike instanceof Error ?
                                                        checkError.compatibleInstance(reason, errorLike) :
                                                        checkError.compatibleConstructor(reason, errorLike));

                const errMsgMatcherCompatible = errMsgMatcher && checkError.compatibleMessage(reason, errMsgMatcher);

                const reasonName = getReasonName(reason);

                if (negate && everyArgIsDefined) {
                    if (errorLikeCompatible && errMsgMatcherCompatible) {
                        this.assert(true,
                                    null,
                                    "expected promise not to be rejected with #{exp} but it was rejected " +
                                    "with #{act}",
                                    errorLikeName,
                                    reasonName);
                    }
                } else {
                    if (errorLike) {
                        this.assert(errorLikeCompatible,
                                    "expected promise to be rejected with #{exp} but it was rejected with #{act}",
                                    "expected promise not to be rejected with #{exp} but it was rejected " +
                                    "with #{act}",
                                    errorLikeName,
                                    reasonName);
                    }

                    if (errMsgMatcher) {
                        this.assert(errMsgMatcherCompatible,
                                    `expected promise to be rejected with an error ${matcherRelation} #{exp} but got ` +
                                    `#{act}`,
                                    `expected promise not to be rejected with an error ${matcherRelation} #{exp}`,
                                    errMsgMatcher,
                                    checkError.getMessage(reason));
                    }
                }

                return reason;
            }
        );

        module.exports.transferPromiseness(this, derivedPromise);
        return this;
    });

    property("eventually", function () {
        utils.flag(this, "eventually", true);
        return this;
    });

    method("notify", function (done) {
        doNotify(getBasePromise(this), done);
        return this;
    });

    method("become", function (value, message) {
        return this.eventually.deep.equal(value, message);
    });

    // ### `eventually`

    // We need to be careful not to trigger any getters, thus `Object.getOwnPropertyDescriptor` usage.
    const methodNames = propertyNames.filter(name => {
        return name !== "assert" && typeof propertyDescs[name].value === "function";
    });

    methodNames.forEach(methodName => {
        Assertion.overwriteMethod(methodName, originalMethod => function () {
            return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
        });
    });

    const getterNames = propertyNames.filter(name => {
        return name !== "_obj" && typeof propertyDescs[name].get === "function";
    });

    getterNames.forEach(getterName => {
        // Chainable methods are things like `an`, which can work both for `.should.be.an.instanceOf` and as
        // `should.be.an("object")`. We need to handle those specially.
        const isChainableMethod = Assertion.prototype.__methods.hasOwnProperty(getterName);

        if (isChainableMethod) {
            Assertion.overwriteChainableMethod(
                getterName,
                originalMethod => function () {
                    return doAsserterAsyncAndAddThen(originalMethod, this, arguments);
                },
                originalGetter => function () {
                    return doAsserterAsyncAndAddThen(originalGetter, this);
                }
            );
        } else {
            Assertion.overwriteProperty(getterName, originalGetter => function () {
                return proxifyIfSupported(doAsserterAsyncAndAddThen(originalGetter, this));
            });
        }
    });

    function doAsserterAsyncAndAddThen(asserter, assertion, args) {
        // Since we're intercepting all methods/properties, we need to just pass through if they don't want
        // `eventually`, or if we've already fulfilled the promise (see below).
        if (!utils.flag(assertion, "eventually")) {
            asserter.apply(assertion, args);
            return assertion;
        }

        const derivedPromise = getBasePromise(assertion).then(value => {
            // Set up the environment for the asserter to actually run: `_obj` should be the fulfillment value, and
            // now that we have the value, we're no longer in "eventually" mode, so we won't run any of this code,
            // just the base Chai code that we get to via the short-circuit above.
            assertion._obj = value;
            utils.flag(assertion, "eventually", false);

            return args ? module.exports.transformAsserterArgs(args) : args;
        }).then(newArgs => {
            asserter.apply(assertion, newArgs);

            // Because asserters, for example `property`, can change the value of `_obj` (i.e. change the "object"
            // flag), we need to communicate this value change to subsequent chained asserters. Since we build a
            // promise chain paralleling the asserter chain, we can use it to communicate such changes.
            return assertion._obj;
        });

        module.exports.transferPromiseness(assertion, derivedPromise);
        return assertion;
    }

    // ### Now use the `Assertion` framework to build an `assert` interface.
    const originalAssertMethods = Object.getOwnPropertyNames(assert).filter(propName => {
        return typeof assert[propName] === "function";
    });

    assert.isFulfilled = (promise, message) => (new Assertion(promise, message)).to.be.fulfilled;

    assert.isRejected = (promise, errorLike, errMsgMatcher, message) => {
        const assertion = new Assertion(promise, message);
        return assertion.to.be.rejectedWith(errorLike, errMsgMatcher, message);
    };

    assert.becomes = (promise, value, message) => assert.eventually.deepEqual(promise, value, message);

    assert.doesNotBecome = (promise, value, message) => assert.eventually.notDeepEqual(promise, value, message);

    assert.eventually = {};
    originalAssertMethods.forEach(assertMethodName => {
        assert.eventually[assertMethodName] = function (promise) {
            const otherArgs = Array.prototype.slice.call(arguments, 1);

            let customRejectionHandler;
            const message = arguments[assert[assertMethodName].length - 1];
            if (typeof message === "string") {
                customRejectionHandler = reason => {
                    throw new chai.AssertionError(`${message}\n\nOriginal reason: ${utils.inspect(reason)}`);
                };
            }

            const returnedPromise = promise.then(
                fulfillmentValue => assert[assertMethodName].apply(assert, [fulfillmentValue].concat(otherArgs)),
                customRejectionHandler
            );

            returnedPromise.notify = done => {
                doNotify(returnedPromise, done);
            };

            return returnedPromise;
        };
    });
};

module.exports.transferPromiseness = (assertion, promise) => {
    assertion.then = promise.then.bind(promise);
};

module.exports.transformAsserterArgs = values => values;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _play = __webpack_require__(1);

var _play2 = _interopRequireDefault(_play);

var _loop = __webpack_require__(2);

var _loop2 = _interopRequireDefault(_loop);

var _playgroove = __webpack_require__(4);

var _playgroove2 = _interopRequireDefault(_playgroove);

var _grainread = __webpack_require__(0);

var _grainread2 = _interopRequireDefault(_grainread);

var _playgrain = __webpack_require__(3);

var _playgrain2 = _interopRequireDefault(_playgrain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var chai = require('chai');
var chaiAsPromised = __webpack_require__(5); // import { setSettings } from '../src/js/soundbridge.js';
// import * as json from '../src/js/settings.js';

chai.use(chaiAsPromised);
// var expect = chai.expect;


describe('Play Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    //let XMLHttpRequest = global.XMLHttpRequest;
    var testing;

    describe('initial state', function () {

        before(function (done) {
            var wait = 2500;
            this.timeout(wait);
            testing = new _play2.default(audio, context);
            setTimeout(function () {
                done();
            }, wait - 200);
        });

        it('starts a new instance', function () {
            console.log("testing: ", testing);
            expect(testing).to.be.an("object");
        });

        it('names the audio file', function () {
            expect(testing.audio).to.equal(audio);
        });

        it('fills the audio buffer', function () {
            expect(testing.buffer.duration).to.be.within(90, 91);
        });

        it('begins at position 0', function () {
            expect(testing.position).to.equal(0);
        });

        it('is stopped', function () {
            expect(testing.stopped).to.be.true;
        });

        it('begins at volume level 0', function () {
            expect(testing.vol).to.equal(0);
        });
    });

    describe('things', function () {

        it('vol()', function () {
            testing.vol = 0.5;
            expect(testing.vol).to.equal(0.5);
        });

        it('startSample()', function () {
            testing.startSample(0);
            expect(testing.stopped).to.be.false;
        });

        it('stop()', function () {
            testing.startSample(0);
            testing.stop();
            expect(testing.stopped).to.be.true;
        });

        it.skip('elapsedTime()', function () {});

        it('position()', function () {
            testing.position = 10.25;
            expect(testing.position).to.equal(10.25);
            testing.position = 2;
            expect(testing.position).to.equal(2);
        });

        it('len()', function () {
            testing.len = 5;
            expect(testing.len).to.equal(5);
            expect(testing.loopEnd - testing.loopStart).to.equal(5);
        });

        it('do not allow length to be greater than the sample', function () {
            testing.position = 0;
            testing.len = 5000;
            expect(testing.loopEnd).to.equal(testing.duration);
        });

        afterEach(function () {
            testing.stop();
        });
    });
});

describe('Loop Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    var lp = new _loop2.default(audio, context);

    it('should start a new instance', function () {
        expect(lp).to.exist;
    });

    it('starts a loop at the correct spot', function () {
        lp.loop(22);
        expect(lp.position).to.equal(lp.duration * 0.3);
    });

    it('turns the delay on', function () {
        //lp.delaySwitch(true);
        //expect()... delay to be on

    });

    it('turns the delay off', function () {
        //lp.delaySwitch(false);
        //expect()... delay to be off
    });
});

/* global it */
/* global describe */
/* global expect */

describe('Playgroove Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    var pg = new _playgroove2.default(audio, context);

    console.log(pg);
    describe('initial values', function () {

        it('starts a new Playgroove class', function () {
            expect(pg).to.exist;
        });

        it('sets the audio', function () {
            expect(pg.audio).to.equal('/audio/arlene.mp3');
        });

        it('fills the audio buffer', function () {
            expect(pg.src.buffer.duration).to.be.within(90, 91);
        });
    });

    describe('utility functions', function () {

        it('restricts the value to between 0 and 1', function () {
            expect(pg._restrict(1.0001)).to.equal(1);
            expect(pg._restrict(-0.4)).to.equal(0);
        });
    });

    describe('parameters', function () {

        it('sets the delay time', function () {
            pg.delTime(0.125);
            expect(pg.delay.delayTime.value).to.equal(0.125);
        });

        it('sets the delay feedback', function () {
            pg.delFeedback(0.5);
            expect(pg.feedback.gain.value).to.equal(0.5);
        });

        it('sets the playback rate', function () {
            pg.pbRate(0.25);
            expect(pg.src.playbackRate.value).to.equal(0.25);
        });

        it('sets the volume', function () {
            pg.vol(0.75);
            expect(pg.volume.gain.value).to.equal(0.75);
        });
    });

    describe('delay switch', function () {

        it('turns the delay on', function () {
            pg.delaySwitch(true);
            pg.delay.disconnect(pg.feedback);
            pg.feedback.disconnect(pg.delay);
            //This ^^ should throw no errors...
            //  but if it does, this test will fail
        });

        it('turns the delay off', function () {
            pg.delaySwitch(false);
            expect(function () {
                return pg.delay.disconnect(pg.feedback);
            }).to.throw;
            expect(function () {
                return pg.feedback.disconnect(pg.delay);
            }).to.throw;
        });
    });
});

describe('Grainread Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    var gr = new _grainread2.default(audio, context, 1);

    describe('initial values', function () {

        it('starts a new grainread class', function () {
            expect(gr).to.exist;
        });

        it('sets the audio', function () {
            expect(gr.audio).to.equal('/audio/arlene.mp3');
        });

        it('fills the audio buffer', function () {
            expect(gr.buffer.duration).to.be.within(90, 91);
        });

        it('sets fb values', function () {
            expect(gr.fb_amount).to.equal(0);
            expect(gr.fb_position).to.equal(121);
            expect(gr.fb_jitter).to.equal(272);
        });

        it('is stopped', function () {
            expect(gr.stopped).to.be.true;
        });

        it('begins at volume level 1', function () {
            expect(gr.vol).to.equal(1);
        });
    });

    describe('setters and getters', function () {

        it('volume', function () {
            gr.vol = .75;
            expect(gr.vol).to.equal(.75);
            expect(gr.volume.gain.value).to.equal(.75);
        });

        it('delays', function () {
            gr.delays = .25;
            expect(gr.delays).to.equal(.25);
            expect(gr.delayA.delayTime.value).to.equal(.25);
        });

        it('feedback', function () {
            gr.feedback = .5;
            expect(gr.feedback).to.equal(.5);
            expect(gr.fbkA.gain.value).to.equal(.5);
        });

        it('position', function () {
            gr.position = 25;
            expect(gr.position).to.equal(25);
            expect(gr.src.loopStart).to.equal(25);
        });

        it('loopLength', function () {
            gr.loopLength = 10;
            expect(gr.loopLength).to.equal(10);
            expect(gr.src.loopEnd - gr.src.loopStart).to.equal(10);
        });
        it('speed', function () {
            gr.speed = 0.5;
            expect(gr.speed).to.equal(0.5);
            expect(gr.g_speed).to.equal(0.5);
        });
        it('fade', function () {
            gr.fade = 100;
            expect(gr.fade).to.equal(100);
            expect(gr.g_fade).to.equal(100);
        });
        it('read', function () {
            gr.read = 1;
            expect(gr.read).to.equal(1);
            expect(gr.g_read).to.equal(1);
        });
        it('speedspread', function () {
            gr.speedspread = 12;
            expect(gr.speedspread).to.equal(12);
            expect(gr.g_speedspread).to.equal(12);
        });
        it('spread', function () {
            gr.spread = 2;
            expect(gr.spread).to.equal(2);
            expect(gr.g_spread).to.equal(2);
        });
        it('scatter', function () {
            gr.scatter = 19;
            expect(gr.scatter).to.equal(19);
            expect(gr.g_scatter).to.equal(19);
        });
        // loopLength, speed, fade, read, speedspread, spread, scatter
    });

    describe('methods', function () {

        it('restarts at a given time', function () {
            gr.restartAtTime(10);
            expect(gr.stopped).to.be.false;
        });

        it('starts and stops', function () {
            gr.start();
            expect(gr.stopped).to.be.false;
            gr.stop();
            expect(gr.stopped).to.be.true;
        });

        after(function () {
            gr.stop();
        });
    });
});

describe('Playgrain Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    var pg = new _playgrain2.default(audio, context);

    console.log("playgrain: ", pg);

    it('starts a new play class', function () {
        expect(pg).to.exist;
    });

    it('includes 10 instances of Grainread', function () {
        expect(pg.a.constructor.name).to.equal("Grainread");
        expect(pg.b.constructor.name).to.equal("Grainread");
        expect(pg.c.constructor.name).to.equal("Grainread");
        expect(pg.d.constructor.name).to.equal("Grainread");
        expect(pg.e.constructor.name).to.equal("Grainread");
        expect(pg.f.constructor.name).to.equal("Grainread");
        expect(pg.g.constructor.name).to.equal("Grainread");
        expect(pg.h.constructor.name).to.equal("Grainread");
        expect(pg.i.constructor.name).to.equal("Grainread");
        expect(pg.j.constructor.name).to.equal("Grainread");
    });

    it('sets the fade amount for all instances', function () {
        pg.fade = .75;
        expect(pg.a.fade).to.equal(.75);
        expect(pg.b.fade).to.equal(.75);
        expect(pg.c.fade).to.equal(.75);
        expect(pg.d.fade).to.equal(.75);
        expect(pg.e.fade).to.equal(.75);
        expect(pg.f.fade).to.equal(.75);
        expect(pg.g.fade).to.equal(.75);
        expect(pg.h.fade).to.equal(.75);
        expect(pg.i.fade).to.equal(.75);
        expect(pg.j.fade).to.equal(.75);
    });

    it('sets the feedback position for all instances', function () {
        pg.feedback = .5;
        expect(pg.a.feedback).to.equal(.5);
        expect(pg.b.feedback).to.equal(.5);
        expect(pg.c.feedback).to.equal(.5);
        expect(pg.d.feedback).to.equal(.5);
        expect(pg.e.feedback).to.equal(.5);
        expect(pg.f.feedback).to.equal(.5);
        expect(pg.g.feedback).to.equal(.5);
        expect(pg.h.feedback).to.equal(.5);
        expect(pg.i.feedback).to.equal(.5);
        expect(pg.j.feedback).to.equal(.5);
    });

    it('sets the read position for all instances', function () {
        pg.read = 12;
        expect(pg.a.read).to.equal(12);
        expect(pg.b.read).to.equal(12);
        expect(pg.c.read).to.equal(12);
        expect(pg.d.read).to.equal(12);
        expect(pg.e.read).to.equal(12);
        expect(pg.f.read).to.equal(12);
        expect(pg.g.read).to.equal(12);
        expect(pg.h.read).to.equal(12);
        expect(pg.i.read).to.equal(12);
        expect(pg.j.read).to.equal(12);
    });

    it('sets the scatter differently for each instance', function () {
        pg.scatter = .75;
        expect(pg.a.scatter).to.not.equal(pg.j.scatter);
        expect(pg.b.scatter).to.not.equal(pg.a.scatter);
        expect(pg.c.scatter).to.not.equal(pg.b.scatter);
        expect(pg.d.scatter).to.not.equal(pg.c.scatter);
        expect(pg.e.scatter).to.not.equal(pg.d.scatter);
        expect(pg.f.scatter).to.not.equal(pg.e.scatter);
        expect(pg.g.scatter).to.not.equal(pg.f.scatter);
        expect(pg.h.scatter).to.not.equal(pg.g.scatter);
        expect(pg.i.scatter).to.not.equal(pg.h.scatter);
        expect(pg.j.scatter).to.not.equal(pg.i.scatter);
    });

    it('sets the spread value for all instances', function () {
        pg.spread = 2;
        expect(pg.a.spread).to.equal(2);
        expect(pg.b.spread).to.equal(2);
        expect(pg.c.spread).to.equal(2);
        expect(pg.d.spread).to.equal(2);
        expect(pg.e.spread).to.equal(2);
        expect(pg.f.spread).to.equal(2);
        expect(pg.g.spread).to.equal(2);
        expect(pg.h.spread).to.equal(2);
        expect(pg.i.spread).to.equal(2);
        expect(pg.j.spread).to.equal(2);
    });

    it('sets the volume for all instances', function () {
        pg.vol = 0.5;
        expect(pg.a.vol).to.equal(0.5);
        expect(pg.b.vol).to.equal(0.5);
        expect(pg.c.vol).to.equal(0.5);
        expect(pg.d.vol).to.equal(0.5);
        expect(pg.e.vol).to.equal(0.5);
        expect(pg.f.vol).to.equal(0.5);
        expect(pg.g.vol).to.equal(0.5);
        expect(pg.h.vol).to.equal(0.5);
        expect(pg.i.vol).to.equal(0.5);
        expect(pg.j.vol).to.equal(0.5);
    });

    it('starts playing all instances', function () {
        pg.start();
        expect(pg.a.stopped).to.be(false);
        expect(pg.b.stopped).to.be(false);
        expect(pg.c.stopped).to.be(false);
        expect(pg.d.stopped).to.be(false);
        expect(pg.e.stopped).to.be(false);
        expect(pg.f.stopped).to.be(false);
        expect(pg.g.stopped).to.be(false);
        expect(pg.h.stopped).to.be(false);
        expect(pg.i.stopped).to.be(false);
        expect(pg.j.stopped).to.be(false);
    });

    it('stops playing all instances', function () {
        pg.stop();
        expect(pg.a.stopped).to.be(true);
        expect(pg.b.stopped).to.be(true);
        expect(pg.c.stopped).to.be(true);
        expect(pg.d.stopped).to.be(true);
        expect(pg.e.stopped).to.be(true);
        expect(pg.f.stopped).to.be(true);
        expect(pg.g.stopped).to.be(true);
        expect(pg.h.stopped).to.be(true);
        expect(pg.i.stopped).to.be(true);
        expect(pg.j.stopped).to.be(true);
    });
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* !
 * Chai - checkError utility
 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### .checkError
 *
 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
 *
 * @api public
 */

/**
 * ### .compatibleInstance(thrown, errorLike)
 *
 * Checks if two instances are compatible (strict equal).
 * Returns false if errorLike is not an instance of Error, because instances
 * can only be compatible if they're both error instances.
 *
 * @name compatibleInstance
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleInstance(thrown, errorLike) {
  return errorLike instanceof Error && thrown === errorLike;
}

/**
 * ### .compatibleConstructor(thrown, errorLike)
 *
 * Checks if two constructors are compatible.
 * This function can receive either an error constructor or
 * an error instance as the `errorLike` argument.
 * Constructors are compatible if they're the same or if one is
 * an instance of another.
 *
 * @name compatibleConstructor
 * @param {Error} thrown error
 * @param {Error|ErrorConstructor} errorLike object to compare against
 * @namespace Utils
 * @api public
 */

function compatibleConstructor(thrown, errorLike) {
  if (errorLike instanceof Error) {
    // If `errorLike` is an instance of any error we compare their constructors
    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
    return thrown.constructor === errorLike || thrown instanceof errorLike;
  }

  return false;
}

/**
 * ### .compatibleMessage(thrown, errMatcher)
 *
 * Checks if an error's message is compatible with a matcher (String or RegExp).
 * If the message contains the String or passes the RegExp test,
 * it is considered compatible.
 *
 * @name compatibleMessage
 * @param {Error} thrown error
 * @param {String|RegExp} errMatcher to look for into the message
 * @namespace Utils
 * @api public
 */

function compatibleMessage(thrown, errMatcher) {
  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
  if (errMatcher instanceof RegExp) {
    return errMatcher.test(comparisonString);
  } else if (typeof errMatcher === 'string') {
    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
  }

  return false;
}

/**
 * ### .getFunctionName(constructorFn)
 *
 * Returns the name of a function.
 * This also includes a polyfill function if `constructorFn.name` is not defined.
 *
 * @name getFunctionName
 * @param {Function} constructorFn
 * @namespace Utils
 * @api private
 */

var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
function getFunctionName(constructorFn) {
  var name = '';
  if (typeof constructorFn.name === 'undefined') {
    // Here we run a polyfill if constructorFn.name is not defined
    var match = String(constructorFn).match(functionNameMatch);
    if (match) {
      name = match[1];
    }
  } else {
    name = constructorFn.name;
  }

  return name;
}

/**
 * ### .getConstructorName(errorLike)
 *
 * Gets the constructor name for an Error instance or constructor itself.
 *
 * @name getConstructorName
 * @param {Error|ErrorConstructor} errorLike
 * @namespace Utils
 * @api public
 */

function getConstructorName(errorLike) {
  var constructorName = errorLike;
  if (errorLike instanceof Error) {
    constructorName = getFunctionName(errorLike.constructor);
  } else if (typeof errorLike === 'function') {
    // If `err` is not an instance of Error it is an error constructor itself or another function.
    // If we've got a common function we get its name, otherwise we may need to create a new instance
    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
    constructorName = getFunctionName(errorLike).trim() ||
        getFunctionName(new errorLike()); // eslint-disable-line new-cap
  }

  return constructorName;
}

/**
 * ### .getMessage(errorLike)
 *
 * Gets the error message from an error.
 * If `err` is a String itself, we return it.
 * If the error has no message, we return an empty string.
 *
 * @name getMessage
 * @param {Error|String} errorLike
 * @namespace Utils
 * @api public
 */

function getMessage(errorLike) {
  var msg = '';
  if (errorLike && errorLike.message) {
    msg = errorLike.message;
  } else if (typeof errorLike === 'string') {
    msg = errorLike;
  }

  return msg;
}

module.exports = {
  compatibleInstance: compatibleInstance,
  compatibleConstructor: compatibleConstructor,
  compatibleMessage: compatibleMessage,
  getMessage: getMessage,
  getConstructorName: getConstructorName,
};


/***/ })
/******/ ]);