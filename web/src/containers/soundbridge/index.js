import { h, Component, Fragment } from 'preact';
import Socket from 'context/Socket';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';
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
            started: false,
            settings: false,
            settingNumber: 0,
            solo: false,
        };

        this.begin = this.begin.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
        this.listenForSettings = this.listenForSettings.bind(this);
    }

    begin() {
        this.setState(() => ({started: true}));
    }

    changeSettings(i) {
        console.info('changing settings to ', i);
        const settings = getSettings(i);
        this.setState({settings, settingNumber: i});
    }

    componentDidMount() {
        window.globalAudioContext = new window.AudioContext();
        if (!this.props.solo) {
            this.ws.on('setting', n => {
                console.info('new setting: ', n.currentSetting);
                this.changeSettings(n.currentSetting);
            });
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
                        isPerformer={this.props.isPerformer}
                        settingNumber={this.state.settingNumber}
                        settings={this.state.settings}
                    />
                )}

            </div>
        );
    }
}

export default Soundbridge;
// export default function SocketedSoundbridge(props) {
//     return <Socket.Consumer>
//         {socket => <Soundbridge {...props} socket={socket} /> }
//     </Socket.Consumer>;
// };
