import { h, Component } from 'preact';
import { Zero, One, Two, Three } from '../../components/Sensors';
import XYPad from '../../components/XYPad';
import soundbridge from '../../js/soundbridge';
import getSettings from './settings';
import styles from '../../style/bridge.scss';

class Soundbridge extends Component {

    constructor() {
        super();
        this.openConnection = false;

        this.startWithSettings = this.startWithSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
    }

    startWithSettings(ws, i) {
        const settings = getSettings(i);
        soundbridge(settings, ws, this.openConnection);
    }

    soloStart() {
        const soloBox = document && document.getElementById('solo-box');
        if (!!soloBox) soloBox.style = 'display: block';
        const i = Math.floor(Math.random() * 29);
        const ws = {};
        ws.on = (a,b) => {};
        this.startWithSettings(ws, i);
    }

    componentDidMount() {
        const ioScript = document.createElement('script');
        ioScript.type = 'text/javascript';
        ioScript.src = '/socket.io/socket.io.js';
        ioScript.onload = () => {
            if (typeof io !== "function") return this.soloStart();

            const ws = io();
            ws.on('setting', function(n) {
                this.openConnection = true;
                this.startWithSettings(ws, n);
            });
        };
        ioScript.onerror = this.soloStart;

        document.getElementsByTagName('head')[0].appendChild(ioScript);
    }

    render() {
        return (
            <div class="soundbridge">
                <h1>Soundbridge Preact!</h1>

                <Zero />
                <One />
                <Two />
                <Three />

                <XYPad />
            </div>
        );
    }
}

export default Soundbridge;
