import { h, Component, Fragment } from 'preact';
import Socket from 'context/Socket';
import { Zero, One, Two, Three } from 'components/Sensors';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';

import getSettings from './settings';
import styles from 'styles/bridge.scss';

const Status = (props, children) => (
    <span id={props.type + '-status'} className='status'>
        {props.display || props.children}
    </span>
);

const StatusBox = props => {
    const { solo, isPerformer, performers, audienceMembers } = props;
    return (
        <div id='status-box'>
            { solo && <Status type='solo' display="SOLO" /> }
            <Status type='userType' display={isPerformer ? 'performer' : 'audience'} />
            <Status type='performers' display={performers} />
            <Status type='audience' display={audienceMembers} />
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
            isPerformer: false,
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
        this.ws.on('join', n => {
            console.info('joined: ', n);
            const { currentSetting, userType } = n;
            this.changeSettings(currentSetting);
            this.setState(() => ({ isPerformer: userType === 'performer' }));
        });

        this.ws.on('setting', n => {
            console.info('new setting: ', n.currentSetting);
            this.changeSettings(n.currentSetting);
        });

        this.ws.on('newUser', n => {
            this.setState(state => {
                if (n.userType === 'performer') state.performers.push(n.name);
                else state.audienceMembers.push(n.name);
                return state;
            });
        });
        // this.ws.on('userLeaving', n => {
            // this.setState(state => {
            //     if (n.userType === 'performer')
            //         // state.performers.push(n.name);
            //     else
            //         // state.audienceMembers.push(n.name);
            // });
        // });
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

                <StatusBox
                    solo={this.state.solo}
                    isPerformer={this.state.isPerformer}
                    performers={this.state.performers}
                    audienceMembers={this.state.audienceMembers}
                />

                { !this.state.started && (
                    <button className='start' onClick={this.handleAudioOn.bind(this)}>
                        <h2>{this.state.ioReady ? 'Start' : 'Not Ready'}</h2>
                    </button>
                )}

                {this.state.settings && (
                    <Fragment>
                        <Zero
                            active={this.state.isPerformer}
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[0],
                                delay: this.state.settings.delay[0],
                                grain: this.state.settings.grain
                            }}
                        />
                        <One
                            active={this.state.isPerformer}
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[1],
                                delay: this.state.settings.delay[1],
                                grain: this.state.settings.grain
                            }}
                        />
                        <Two
                            active={this.state.isPerformer}
                            settings={{
                                index: this.state.settingNumber,
                                sample: this.state.settings.samples[2],
                                delay: this.state.settings.delay[2],
                                grain: this.state.settings.grain
                            }}
                        />
                        <Three
                            active={this.state.isPerformer}
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
