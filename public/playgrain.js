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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/synths/playgrain/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/synths/grainread/index.ts":
/*!***************************************!*\
  !*** ./src/synths/grainread/index.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Grainread; });\n/* harmony import */ var _utils_clip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/clip */ \"./src/synths/utils/clip.ts\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n/**\n * Grainread class\n * a single series of grains\n  for the playgrain class\n * Created by Mike Sperone on 8/25/16.\n *\n*/\n\nvar Grainread = /*#__PURE__*/function () {\n  function Grainread(audio, context, g_read) {\n    var g_multiply = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;\n    var g_fade = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;\n    var g_spread = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 20;\n    var g_scatter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 28;\n\n    _classCallCheck(this, Grainread);\n\n    _defineProperty(this, \"audio\", void 0);\n\n    _defineProperty(this, \"context\", void 0);\n\n    _defineProperty(this, \"g_read\", void 0);\n\n    _defineProperty(this, \"g_multiply\", void 0);\n\n    _defineProperty(this, \"g_fade\", void 0);\n\n    _defineProperty(this, \"g_spread\", void 0);\n\n    _defineProperty(this, \"g_scatter\", void 0);\n\n    _defineProperty(this, \"g_speed\", void 0);\n\n    _defineProperty(this, \"g_speedspread\", void 0);\n\n    _defineProperty(this, \"fb_amount\", void 0);\n\n    _defineProperty(this, \"fb_position\", void 0);\n\n    _defineProperty(this, \"fb_jitter\", void 0);\n\n    _defineProperty(this, \"len\", void 0);\n\n    _defineProperty(this, \"buffer\", void 0);\n\n    _defineProperty(this, \"duration\", void 0);\n\n    _defineProperty(this, \"stopped\", void 0);\n\n    _defineProperty(this, \"src\", void 0);\n\n    _defineProperty(this, \"envelope\", void 0);\n\n    _defineProperty(this, \"panner\", void 0);\n\n    _defineProperty(this, \"splitter\", void 0);\n\n    _defineProperty(this, \"merge\", void 0);\n\n    _defineProperty(this, \"delayA\", void 0);\n\n    _defineProperty(this, \"delayB\", void 0);\n\n    _defineProperty(this, \"feedbackA\", void 0);\n\n    _defineProperty(this, \"feedbackB\", void 0);\n\n    _defineProperty(this, \"volume\", void 0);\n\n    this.g_read = g_read;\n    this.g_multiply = g_multiply;\n    this.g_fade = g_fade;\n    this.g_spread = g_spread;\n    this.g_scatter = g_scatter;\n    this.fb_amount = 0;\n    this.fb_position = 121;\n    this.fb_jitter = 272;\n    this.len = 12;\n    this.audio = audio;\n    this.context = context;\n    this.buffer = null;\n    this.duration = 0;\n    this.stopped = true;\n    this.src = this.context.createBufferSource();\n    this.envelope = this.context.createGain();\n    this.panner = this.context.createStereoPanner();\n    this.splitter = this.context.createChannelSplitter(2);\n    this.merge = this.context.createChannelMerger(2);\n    this.delayA = this.context.createDelay(0.5);\n    this.delayB = this.context.createDelay(0.5);\n    this.feedbackA = this.context.createGain();\n    this.feedbackA.gain.value = 0.5;\n    this.feedbackB = this.context.createGain();\n    this.feedbackB.gain.value = 0.5;\n    this.volume = this.context.createGain();\n    this.bind.call(this);\n  }\n\n  _createClass(Grainread, [{\n    key: \"bind\",\n    value: function bind() {\n      this.loadAudio = this.loadAudio.bind(this);\n      this.restartAtTime = this.restartAtTime.bind(this);\n      this.play = this.play.bind(this);\n      this.start = this.start.bind(this);\n      this.stop = this.stop.bind(this);\n      this.changeVolume = this.changeVolume.bind(this);\n      this.forwardInTime = this.forwardInTime.bind(this);\n      this.randomScatter = this.randomScatter.bind(this);\n      this.phasor = this.phasor.bind(this);\n    }\n  }, {\n    key: \"loadAudio\",\n    value: function loadAudio() {\n      var _this = this;\n\n      console.info('grainread loadAudio()');\n      return new Promise(function (resolve, reject) {\n        var that = _this;\n        var req = new XMLHttpRequest();\n        req.open('GET', _this.audio);\n        req.responseType = 'arraybuffer';\n\n        req.onload = function () {\n          var audioData = req.response;\n\n          _this.context.decodeAudioData(audioData, function (buffer) {\n            _this.src.buffer = buffer;\n            _this.buffer = buffer;\n            _this.duration = _this.buffer.duration;\n\n            _this.src.connect(_this.envelope);\n\n            _this.envelope.connect(_this.delayA);\n\n            _this.envelope.connect(_this.delayB);\n\n            _this.delayA.connect(_this.feedbackA);\n\n            _this.delayB.connect(_this.feedbackB);\n\n            _this.feedbackA.connect(_this.delayA);\n\n            _this.feedbackB.connect(_this.delayB);\n\n            _this.delayA.connect(_this.merge, 0, 0);\n\n            _this.delayB.connect(_this.merge, 0, 1);\n\n            _this._connectIfPanner([_this.merge, _this.panner]); //this.merge.connect(this.panner);\n\n\n            _this.src.loop = true; //this.envelope.connect(this.panner);\n\n            _this._connectIfPanner([_this.panner, _this.volume], [_this.merge, _this.volume]);\n\n            _this.volume.connect(_this.context.destination); // this.forwardInTime();\n            // this.phasor();\n\n\n            return resolve({\n              status: \"success\",\n              message: \"\"\n            });\n          }, function (e) {\n            return reject({\n              status: \"error\",\n              message: \"Error decoding audio data\" + e\n            });\n          });\n        };\n\n        req.onerror = function (err) {\n          return reject({\n            status: \"error\",\n            message: err\n          });\n        };\n\n        req.send();\n      });\n    }\n  }, {\n    key: \"_connectIfPanner\",\n    value: function _connectIfPanner(a) {\n      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n\n      if (this.panner.empty !== true) {\n        console.debug(\"connection panner\");\n        a[0].connect(a[1]);\n      } else {\n        console.debug(\"panner left out\");\n\n        if (b.length) {\n          b[0].connect(b[1]);\n        }\n      }\n    }\n  }, {\n    key: \"restartAtTime\",\n    value: function restartAtTime(t) {\n      this.stop();\n      this.src = this.context.createBufferSource();\n      this.src.buffer = this.buffer;\n      this.src.loop = true; // it seems as if speed and multiply are just always 1\n      // this.src.playbackRate = (this.g_speed * this.g_multiply);\n\n      this.src.connect(this.envelope);\n      this.src.start(0, t);\n      this.stopped = false;\n    }\n  }, {\n    key: \"play\",\n    value: function play() {\n      this.src.start(0);\n      this.stopped = false;\n    }\n  }, {\n    key: \"start\",\n    value: function start() {\n      if (this.stopped) {\n        this.phasor();\n        this.restartAtTime(0);\n        this.stopped = false; // as a backup in case restartAtTime() fails... necessary?\n      }\n    }\n  }, {\n    key: \"stop\",\n    value: function stop() {\n      if (!this.stopped) {\n        this.src.stop(0);\n        this.stopped = true;\n      }\n    }\n  }, {\n    key: \"changeVolume\",\n    value: function changeVolume(v) {\n      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.001;\n      this.volume.gain.cancelScheduledValues(this.context.currentTime);\n      this.volume.gain.linearRampToValueAtTime(v, this.context.currentTime + t);\n    }\n  }, {\n    key: \"toString\",\n    value: function toString() {\n      return {\n        \"audio\": this.audio,\n        \"context\": this.context,\n        \"g_read\": this.g_read,\n        \"g_speed\": this.g_speed,\n        \"g_multiply\": this.g_multiply,\n        \"g_fade\": this.g_fade,\n        \"g_speedspread\": this.g_speedspread,\n        \"g_spread\": this.g_spread,\n        \"g_scatter\": this.g_scatter\n      };\n    }\n  }, {\n    key: \"randomScatter\",\n    value: function randomScatter() {\n      return Math.random() * this.g_scatter / 127;\n    }\n  }, {\n    key: \"forwardInTime\",\n    value: function forwardInTime() {\n      var internalCallback = function () {\n        if (this.stopped) return;\n        this.position = this.position + 0.1;\n        window.setTimeout(function () {\n          return window.requestAnimationFrame(internalCallback);\n        }, 100);\n      }.bind(this);\n\n      window.setTimeout(function () {\n        return window.requestAnimationFrame(internalCallback);\n      }, 100);\n    }\n  }, {\n    key: \"phasor\",\n    value: function phasor() {\n      var _this2 = this;\n\n      var that = this;\n      this.forwardInTime();\n\n      var internalCallback = function internalCallback() {\n        return window.requestAnimationFrame(function () {\n          if (_this2.stopped) return;\n          var time = Math.random() * _this2.g_read * 2 + 0.1;\n          window.setTimeout(internalCallback.bind(_this2), time * 1000); // Setting\n\n          var position = (_this2.g_read + _this2.randomScatter()) * _this2.duration;\n\n          _this2.position = Object(_utils_clip__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(position, {\n            max: _this2.duration\n          });\n          _this2.loopLength = (_this2.g_read * 29 + 6) * 50; // based on each sample\n\n          var pannerValue = _this2.spread * 0.4 * Math.random() - 1;\n\n          _this2.panner.pan.setValueAtTime(pannerValue, _this2.context.currentTime);\n\n          var now = _this2.context.currentTime;\n          var e = _this2.envelope.gain;\n          e.cancelScheduledValues(now);\n          e.setValueAtTime(0.0001, now);\n\n          _this2.restartAtTime(_this2.position);\n\n          e.exponentialRampToValueAtTime(1, now + time / 2);\n          e.exponentialRampToValueAtTime(0.0001, now + time);\n        });\n      }; //TODO: use AnimationFrame instead\n\n\n      window.setTimeout(internalCallback.bind(this), 500);\n    }\n  }, {\n    key: \"vol\",\n    set: function set(v) {\n      this.changeVolume(v);\n    },\n    get: function get() {\n      return this.volume.gain.value;\n    }\n  }, {\n    key: \"delays\",\n    set: function set(d) {\n      this.delayA.delayTime.value = d;\n    },\n    get: function get() {\n      return this.delayA.delayTime.value;\n    }\n  }, {\n    key: \"feedback\",\n    set: function set(f) {\n      this.feedbackA.gain.value = f;\n    },\n    get: function get() {\n      return this.feedbackA.gain.value;\n    }\n  }, {\n    key: \"position\",\n    set: function set(x) {\n      this.src.loopStart = x;\n    },\n    get: function get() {\n      return this.src.loopStart;\n    }\n  }, {\n    key: \"loopLength\",\n    set: function set(x) {\n      this.src.loopEnd = this.position + x;\n    },\n    get: function get() {\n      return this.src.loopEnd - this.src.loopStart;\n    }\n  }, {\n    key: \"read\",\n    set: function set(gr) {\n      this.g_read = gr;\n    },\n    get: function get() {\n      return this.g_read;\n    }\n  }, {\n    key: \"speed\",\n    set: function set(gs) {\n      this.g_speed = gs;\n    },\n    get: function get() {\n      return this.g_speed;\n    }\n  }, {\n    key: \"fade\",\n    set: function set(gf) {\n      this.g_fade = gf;\n    },\n    get: function get() {\n      return this.g_fade;\n    }\n  }, {\n    key: \"speedspread\",\n    set: function set(ss) {\n      this.g_speedspread = ss;\n    },\n    get: function get() {\n      return this.g_speedspread;\n    }\n  }, {\n    key: \"spread\",\n    set: function set(gs) {\n      this.g_spread = gs;\n    },\n    get: function get() {\n      return this.g_spread;\n    }\n  }, {\n    key: \"scatter\",\n    set: function set(gs) {\n      this.g_scatter = gs;\n    },\n    get: function get() {\n      return this.g_scatter;\n    }\n  }]);\n\n  return Grainread;\n}();\n\n\n\n//# sourceURL=webpack:///./src/synths/grainread/index.ts?");

/***/ }),

/***/ "./src/synths/playgrain/index.ts":
/*!***************************************!*\
  !*** ./src/synths/playgrain/index.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Playgrain; });\n/* harmony import */ var _grainread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../grainread */ \"./src/synths/grainread/index.ts\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n/**\n * Playgrain class\n *\n * Created by Mike on 9/1/16.\n */\n\n\nvar Playgrain = /*#__PURE__*/function () {\n  /**\n   * Grain synthesis of an audio file\n   * @param {string} audio - path to audio file\n   * @param {AudioContext} context - Web Audio Context\n   */\n  function Playgrain(audio, context) {\n    var vol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n\n    _classCallCheck(this, Playgrain);\n\n    _defineProperty(this, \"f\", void 0);\n\n    this.volume = vol;\n    this.maximumVolume = 1.0;\n    this.grainArray = [];\n    var numberOfGrains = 10;\n    var i = 0;\n\n    for (i; i < numberOfGrains; i++) {\n      this.grainArray.push(new _grainread__WEBPACK_IMPORTED_MODULE_0__[\"default\"](audio, context, 1));\n    }\n\n    this.setAllValues = this.setAllValues.bind(this);\n    this.callAllFunctions = this.callAllFunctions.bind(this);\n  }\n\n  _createClass(Playgrain, [{\n    key: \"setAllValues\",\n    value: function setAllValues(parameter, value) {\n      this.grainArray.forEach(function (g) {\n        g[parameter] = value;\n      });\n    }\n  }, {\n    key: \"callAllFunctions\",\n    value: function callAllFunctions(fnName) {\n      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n      this.grainArray.forEach(function (g) {\n        return g[fnName].apply(g, _toConsumableArray(args));\n      });\n    }\n  }, {\n    key: \"loadAudio\",\n    value: function loadAudio() {\n      var promises = [];\n      this.grainArray.forEach(function (g) {\n        return promises.push(g.loadAudio());\n      });\n      return Promise.all(promises);\n    }\n    /**\n     * Sets the fade\n     *\n     *\n     */\n\n  }, {\n    key: \"start\",\n\n    /**\n     *  Starts playing\n     */\n    value: function start() {\n      this.callAllFunctions('start');\n    }\n    /**\n     * Stops playing\n     */\n\n  }, {\n    key: \"stop\",\n    value: function stop() {\n      this.callAllFunctions('stop');\n    }\n  }, {\n    key: \"changeVolume\",\n    value: function changeVolume(v, t) {\n      this.callAllFunctions('changeVolume', [v, t]);\n    }\n    /**\n     * Sets the volume\n     */\n\n  }, {\n    key: \"fade\",\n    set: function set(f) {\n      this.setAllValues('fade', f);\n    }\n    /**\n     * Sets the delay feedback\n     */\n\n  }, {\n    key: \"feedback\",\n    set: function set(f) {\n      this.setAllValues('feedback', f);\n    }\n    /**\n     * Sets the read point\n     */\n\n  }, {\n    key: \"read\",\n    set: function set(gr) {\n      this.setAllValues('read', gr);\n    }\n    /**\n     * Sets the grain scatter amount\n     */\n\n  }, {\n    key: \"scatter\",\n    set: function set(s) {\n      this.setAllValues('scatter', s);\n    }\n    /**\n     * Sets the grain spread\n     */\n\n  }, {\n    key: \"spread\",\n    set: function set(s) {\n      this.setAllValues('spread', s);\n    }\n  }, {\n    key: \"vol\",\n    set: function set(v) {\n      this.volume = this.maximumVolume * v;\n      this.setAllValues('vol', v);\n    }\n    /** Returns the volume*/\n    ,\n    get: function get() {\n      return this.volume;\n    }\n  }, {\n    key: \"volumeScalar\",\n    set: function set(v) {\n      this.maximumVolume = v;\n      this.changeVolume(v, 0.001);\n    }\n  }]);\n\n  return Playgrain;\n}();\n\n\n\n//# sourceURL=webpack:///./src/synths/playgrain/index.ts?");

/***/ }),

/***/ "./src/synths/utils/clip.ts":
/*!**********************************!*\
  !*** ./src/synths/utils/clip.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return clip; });\nfunction clip(num, m) {\n  if (!m) {\n    m = {\n      min: 0,\n      max: 1\n    };\n  } else {\n    if (!m.min) m.min = 0;\n    if (!m.max) m.max = 1;\n  }\n\n  num = Math.max(m.min, num);\n  num = Math.min(m.max, num);\n  return num;\n}\n\n//# sourceURL=webpack:///./src/synths/utils/clip.ts?");

/***/ })

/******/ });