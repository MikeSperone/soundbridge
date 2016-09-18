"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Mike on 9/1/16.
 */

var Playgrain = function () {
    function Playgrain(audio, context) {
        _classCallCheck(this, Playgrain);

        this.audio = audio;
        this.context = context;

        this.a = new Grainread(this.audio, this.context, 1);
        this.b = new Grainread(this.audio, this.context, 1);
        this.c = new Grainread(this.audio, this.context, 1);
        this.d = new Grainread(this.audio, this.context, 1);
        this.e = new Grainread(this.audio, this.context, 1);
        this.f = new Grainread(this.audio, this.context, 1);
        this.g = new Grainread(this.audio, this.context, 1);

        this.a.phasor();
        this.b.phasor();
        this.c.phasor();
        this.d.phasor();
        this.e.phasor();
        this.f.phasor();
        this.g.phasor();
    }

    _createClass(Playgrain, [{
        key: "fade",
        set: function set(f) {
            this.a.fade = f;
            this.b.fade = f;
            this.c.fade = f;
            this.d.fade = f;
            this.e.fade = f;
            this.f.fade = f;
            this.g.fade = f;
        }
    }, {
        key: "feedback",
        set: function set(f) {
            this.a.feedback = f;
            this.b.feedback = f;
            this.c.feedback = f;
            this.d.feedback = f;
            this.e.feedback = f;
            this.f.feedback = f;
            this.g.feedback = f;
        }
    }, {
        key: "read",
        set: function set(gr) {
            this.a.read = gr;
            this.b.read = gr;
            this.c.read = gr;
            this.d.read = gr;
            this.e.read = gr;
            this.f.read = gr;
            this.g.read = gr;
        }
    }, {
        key: "scatter",
        set: function set(s) {
            this.a.scatter = s;
            this.b.scatter = s;
            this.c.scatter = s;
            this.d.scatter = s;
            this.e.scatter = s;
            this.f.scatter = s;
            this.g.scatter = s;
        }
    }, {
        key: "spread",
        set: function set(s) {
            this.a.spread = s;
            this.b.spread = s;
            this.c.spread = s;
            this.d.spread = s;
            this.e.spread = s;
            this.f.spread = s;
            this.g.spread = s;
        }
    }, {
        key: "vol",
        set: function set(w) {
            var v = w / 3;
            this.a.vol = v;
            this.b.vol = v;
            this.c.vol = v;
            this.d.vol = v;
            this.e.vol = v;
            this.f.vol = v;
            this.g.vol = v;
        }
    }]);

    return Playgrain;
}();

//# sourceMappingURL=playgrain.js.map