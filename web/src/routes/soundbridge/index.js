import { h, Component, Fragment } from 'preact';
import { Zero, One, Two, Three } from 'components/Sensors';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';

import getSettings from './settings';
import styles from '../../style/bridge.scss';

const SoloBox = props => {
    let hidden = (props.solo) ? ' hidden' : '';
    return (
        <div id='solo' className={'notification' + hidden}>
            SOLO
        </div>
    );
}

class Soundbridge extends Component {

    constructor() {
        super();
        this.openConnection = false;

        this.state = {
            audio: false,
            ioReady: false,
            messages: {
                debug: '',
            },
            started: false,
            settings: false,
            settingNumber: 0,
            solo: false,
        };

        this.changeSettings = this.changeSettings.bind(this);
        this.startWithSettings = this.startWithSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
    }

    startWithSettings(ws, i) {
        const settings = getSettings(i);
        this.setState({settings, settingNumber: i});
        // soundbridge(settings, ws, this.openConnection);
    }

    soloStart() {
        const i = Math.floor(Math.random() * 29);
        const ws = {};
        ws.on = (a,b) => {};
        this.startWithSettings(ws, i);
    }

    changeSettings(n) {
        if (!this.state.started) return;
        this.setState(() => ({ settings: getSettings(n), settingNumber: n }));
    }

    componentDidMount() {
        window.globalAudioContext = new window.AudioContext();
        const ioScript = document.createElement('script');
        ioScript.type = 'text/javascript';
        ioScript.src = '/socket.io/socket.io.js';
        ioScript.onload = () => {
            this.setState(() => ({ ioReady: true }));
            if (typeof io !== "function") return this.setState(() => ({solo: true}));
            const ws = io();
            ws.on('setting', function(n) {
                this.openConnection = true;
                this.startWithSettings(ws, n);
            });
        };
        ioScript.onerror = () => {
            this.setState(() => ({ioReady: true, solo: true}));
        }

        document.getElementsByTagName('head')[0].appendChild(ioScript);
    }

    handleAudioOn() {
        if (this.state.solo) {
            this.soloStart();
        } else {
            //TODO: not solo start
        }
        this.setState(() => ({started: true}));
    }

    render() {
        return (
            <div class="soundbridge">
                <SelectSetting
                    value={this.state.settingNumber}
                    handleChange={this.changeSettings}
                />

                <SoloBox solo={this.state.solo} />
                { !this.state.started && (
                    <button className='start' onClick={this.handleAudioOn.bind(this)}>
                        <h2>{this.state.ioReady ? 'Start' : 'Not Ready'}</h2>
                    </button>
                )}

                {this.state.settings && (
                    <Fragment>
                        <Zero
                            settings={this.state.settings}
                            sample={this.state.settings.samples[0]}   
                            delay={this.state.settings.delay[0]}
                            grain={this.state.settings.grain}
                        />
                        <One
                            settings={this.state.settings}
                            sample={this.state.settings.samples[1]}   
                            delay={this.state.settings.delay[1]}
                            grain={this.state.settings.grain}
                        />
                        <Two
                            settings={this.state.settings}
                            sample={this.state.settings.samples[2]}   
                            delay={this.state.settings.delay[2]}
                            grain={this.state.settings.grain}
                        />
                        <Three
                            settings={this.state.settings}
                            sample={this.state.settings.samples[3]}   
                            delay={this.state.settings.delay[3]}
                            grain={this.state.settings.grain}
                        />
                    </Fragment>
                )}

            </div>
        );
    }
}

export default Soundbridge;
