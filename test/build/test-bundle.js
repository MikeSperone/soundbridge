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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _play = __webpack_require__(0);

var _play2 = _interopRequireDefault(_play);

var _loop = __webpack_require__(3);

var _loop2 = _interopRequireDefault(_loop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Playgroove from '../src/js/playgroove.js';
// import Grainread from '../src/js/grainread.js';
// import Playgrain from '../src/js/playgrain.js';

// var chai = require('chai');
// import { setSettings } from '../src/js/soundbridge.js';
// import * as json from '../src/js/settings.js';
var chaiAsPromised = __webpack_require__(4);
chai.use(chaiAsPromised);
// var expect = chai.expect;


describe('Play Class', function () {

    var audio = '/audio/arlene.mp3';
    var context = new AudioContext();
    var XMLHttpRequest = global.XMLHttpRequest;
    var testing;

    describe('initial state', function () {

        before(function (done) {
            var wait = 2000;
            this.timeout(wait);
            testing = new _play2.default(audio, context);
            setTimeout(function () {
                done();
            }, wait / 2);
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
    var loop = new _loop2.default(audio, context);

    it('starts a new instance', function () {
        console.log(loop);
        return loop;
    });

    it('sets sensorPos for values above 20', function () {
        loop.sensor(25);
        expect(loop.sensorPos).to.equal(25);
    });

    it('sets position to 0 for values under 11', function () {
        loop.sensor(10);
        expect(loop.position).to.equal(0);
    });

    it('sets length to duration for values < 11', function () {
        loop.sensor(8);
        expect(loop.length).to.equal(loop.duration);
    });

    describe('loop points', function () {
        it(' if value is under 21', function () {
            loop.loop(20);
            expect(loop.position).to.equal(0.9 * loop.duration);
        });

        it('loops at the correct spot for 21', function () {
            loop.loop(21);
            expect(loop.position).to.equal(0.3 * loop.duration);
        });
        it('loops at the correct spot for 23', function () {
            loop.loop(23);
            expect(loop.position).to.equal(0.4 * loop.duration);
        });
        it('loops at the correct spot for 25', function () {
            loop.loop(25);
            expect(loop.position).to.equal(0.5 * loop.duration);
        });
        it('loops at the correct spot for 27', function () {
            loop.loop(27);
            expect(loop.position).to.equal(0.6 * loop.duration);
        });
        it('loops at the correct spot for 29', function () {
            loop.loop(29);
            expect(loop.position).to.equal(0.7 * loop.duration);
        });
        it('loops at the correct spot for 31', function () {
            loop.loop(31);
            expect(loop.position).to.equal(0.8 * loop.duration);
        });
        it('loops at the correct spot for 33', function () {
            loop.loop(33);
            expect(loop.position).to.equal(0.9 * loop.duration);
        });
    });

    describe('delay', function () {
        it('adds things when delay is on', function () {
            loop.delaySwitch(true);
            expect(loop).to.have.property('delay');
            expect(loop).to.have.property('feedback');
            expect(loop).to.have.property('merge');;
        });
        it('sets the delay pan', function () {
            expect(loop).to.have.property('panL');
            expect(loop.panL.pan.value).to.equal(-1);
        });
        it('turns the delay off', function () {
            loop.delaySwitch(false);
            expect(function () {
                loop.delaySwitch(false);
            }).to.throw;
        });
    });

    afterEach(function () {
        loop.stop();
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _play = __webpack_require__(0);

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
                this.src.disconnect(this.volume);

                this.delay = this.context.createDelay(1.0);
                this.feedback = this.context.createGain();
                this.merge = this.context.createChannelMerger(2);
                this.panL = this.context.createStereoPanner();
                this.panL.pan.value = -1;

                this.delay.connect(this.feedback);
                this.feedback.connect(this.delay);
                this.delay.connect(this.merge, 0, 1);
                this.src.connect(this.panL);
                this.src.connect(this.delay);
                this.panL.connect(this.volume);
            } else {
                console.log("delay off");
                if (this.delay) {
                    try {
                        console.log("this.delay exists... disconnecting");
                        this.src.disconnect(this.panL);
                        this.src.disconnect(this.delay);
                    } catch (e) {
                        throw new Error("Disconnected");
                    }
                }
                console.log("connecting to volume...");
                this.src.connect(this.volume);
            }
        }
    }]);

    return Loop;
}(_play2.default);

exports.default = Loop;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-invalid-this */
let checkError = __webpack_require__(5);

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
/* 5 */
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