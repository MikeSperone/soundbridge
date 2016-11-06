'use strict';
/**
 * Created by Mike on 8/25/16.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Ambient = function (_Play) {
    _inherits(Ambient, _Play);

    function Ambient(audio, context) {
        _classCallCheck(this, Ambient);

        var _this = _possibleConstructorReturn(this, (Ambient.__proto__ || Object.getPrototypeOf(Ambient)).call(this, audio, context));

        _this.play();
        return _this;
    }

    return Ambient;
}(Play);