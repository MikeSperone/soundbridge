import { h, Component, Fragment } from 'preact';
import Socket from 'context/Socket';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';
import StatusBox from 'components/Messages/StatusBox';
import Sensors from 'components/Sensors';

import getSettings from './settings';
import styles from 'styles/bridge.scss';

const StartButton = props => (
    <button className='start' onClick={props.begin}>
        <h2>{props.ioReady ? 'Start' : 'Not Ready'}</h2>
    </button>
);

class Soundbridge extends Component {

    constructor(props) {
        super(props);
        this.ws = props.socket;

        this.state = {
            audio: false,
            messages: {
                debug: '',
            },
            performers: [],
            audienceMembers: [],
            isPerformer: false,
            started: false,
            settings: false,
            settingNumber: 0,
            solo: false,
        };

        this.begin = this.begin.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
        this.startWebsocket = this.startWebsocket.bind(this);
    }

    begin() {
        this.setState(() => ({started: true}));
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
            this.setState(() => ({
                userType,
                isPerformer: userType === 'performer',
            }));
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
        this.ws.on('user-exit', n => {
            console.info('user gone');
            // this.setState(state => {
            //     if (n.userType === 'performer')
            //         // state.performers.push(n.name);
            //     else
            //         // state.audienceMembers.push(n.name);
            // });
        });
        this.ws.on('disconnect', () => {
            this.ws.emit('user-left', { userType: this.state.userType, name: 'anonymous' })
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

    render() {
        return (
            <div class="soundbridge">
                {!this.state.started && (
                    <StartButton begin={this.begin} />
                )}

                {this.state.solo &&
                    <SelectSetting
                        value={this.state.settingNumber}
                        handleChange={this.changeSettings}
                    />
                }

                {this.state.settings && this.state.started && (
                    <Sensors
                        isPerformer={this.state.isPerformer}
                        settingNumber={this.state.settingNumber}
                        settings={this.state.settings}
                    />
                )}

                <StatusBox
                    solo={this.state.solo}
                    isPerformer={this.state.isPerformer}
                    performers={this.state.performers}
                    audienceMembers={this.state.audienceMembers}
                />
            </div>
        );
    }
}

export default function SocketedSoundbridge(props) {
    return <Socket.Consumer>
        {socket => <Soundbridge {...props} socket={socket} /> }
    </Socket.Consumer>;
};
