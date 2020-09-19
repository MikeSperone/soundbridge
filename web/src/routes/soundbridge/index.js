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

        this.ws = {
            on: (a,b) => {}
        };

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
        this.soloStart = this.soloStart.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
        this.loadSocketIO = this.loadSocketIO.bind(this);
    }

    changeSettings(i) {
        console.info('changing settings to ', i);
        const settings = getSettings(i);
        this.setState({settings, settingNumber: i});
    }

    soloStart() {
        const i = Math.floor(Math.random() * 29);
        this.changeSettings(i);
    }

    startWebsocket() {
        this.setState(() => ({ ioReady: true }));
        if (typeof io !== "function") return this.setState(() => ({solo: true}));
        this.ws = io();
        this.ws.on('setting', n => {
            console.info('new setting: ', n);
            this.openConnection = true;
            this.changeSettings(n);
        });
    }

    loadSocketIO() {
        return new Promise((resolve, reject) => {
            const ioScript = document.createElement('script');
            ioScript.type = 'text/javascript';
            ioScript.src = '/socket.io/socket.io.js';
            ioScript.onload = resolve;
            ioScript.onerror = reject;

            document.getElementsByTagName('head')[0].appendChild(ioScript);
        })

    }

    componentDidMount() {
        window.globalAudioContext = new window.AudioContext();
        this.loadSocketIO()
            .then(() => this.setState(() => ({ioReady: true})))
            .catch(e => {
                this.soloStart();
                this.setState(() => ({ioReady: true, solo: true}));
            });
    }

    handleAudioOn() {
        if (this.state.solo) {
            this.soloStart();
        } else {
            this.startWebsocket();
        }
        this.setState(() => ({started: true}));
    }

    render() {
        return (
            <div class="soundbridge">
                {this.state.solo &&
                    <SelectSetting
                        value={this.state.settingNumber}
                        handleChange={this.changeSettings}
                    />
                }

                <SoloBox solo={this.state.solo} />
                { !this.state.started && (
                    <button className='start' onClick={this.handleAudioOn.bind(this)}>
                        <h2>{this.state.ioReady ? 'Start' : 'Not Ready'}</h2>
                    </button>
                )}

                {this.state.settings && (
                    <Fragment>
                        <Zero
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[0],   
                                delay: this.state.settings.delay[0],
                                grain: this.state.settings.grain
                            }}
                        />
                        <One
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[1],   
                                delay: this.state.settings.delay[1],
                                grain: this.state.settings.grain
                            }}
                        />
                        <Two
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[2],   
                                delay: this.state.settings.delay[2],
                                grain: this.state.settings.grain
                            }}
                        />
                        <Three
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[3],   
                                delay: this.state.settings.delay[3],
                                grain: this.state.settings.grain
                            }}
                        />
                    </Fragment>
                )}

            </div>
        );
    }
}

export default Soundbridge;
