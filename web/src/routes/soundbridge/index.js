import { h, Component, Fragment } from 'preact';
import Socket from 'context/Socket';
import { Zero, One, Two, Three } from 'components/Sensors';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';

import getSettings from './settings';
import styles from 'styles/bridge.scss';

//TODO: implement the Socket context

const SoloBox = props => {
    let hidden = (props.solo) ? ' hidden' : '';
    return (
        <div id='solo' className={'notification' + hidden}>
            SOLO
        </div>
    );
}

class Soundbridge extends Component {

    constructor(props) {
        super(props);
        this.ws = props.socket;

        this.state = {
            audio: false,
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
        this.ws.on('setting', n => {
            console.info('new setting: ', n);
            this.changeSettings(n);
        });
        // this.ws.on('login', this.handleLogin);
        // this.ws.on('logout', this.handleLogout);
    }

    componentDidMount() {
        window.globalAudioContext = new window.AudioContext();
        if (typeof this.ws.solo !== "undefined" && this.ws.solo === true) {
            this.setState(() => ({ solo: true}));
            this.soloStart();
        } else {
            this.startWebsocket();
        }
    }

    handleAudioOn() {
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

export default function SocketedSoundbridge(props) {
    return <Socket.Consumer>
        {socket => <Soundbridge {...props} socket={socket} /> }
    </Socket.Consumer>;
};
