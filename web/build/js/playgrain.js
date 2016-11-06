"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Playgrain class
 *
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
        this.h = new Grainread(this.audio, this.context, 1);
        this.i = new Grainread(this.audio, this.context, 1);
        this.j = new Grainread(this.audio, this.context, 1);
    }

    _createClass(Playgrain, [{
        key: "start",
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
    }, {
        key: "stop",
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
    }, {
        key: "fade",
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
            this.h.feedback = f;
            this.i.feedback = f;
            this.j.feedback = f;
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
            this.h.read = gr;
            this.i.read = gr;
            this.j.read = gr;
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
            this.h.scatter = s;
            this.i.scatter = s;
            this.j.scatter = s;
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
            this.h.spread = s;
            this.i.spread = s;
            this.j.spread = s;
        }
    }, {
        key: "vol",
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