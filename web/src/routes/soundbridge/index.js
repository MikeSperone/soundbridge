import { h, Component, Fragment } from 'preact';
import { Zero, One, Two, Three } from 'components/Sensors';
import XYPad from 'components/XYPad';
import { Number } from 'react-nexusui';
import Button from 'components/Controls/Button';

// import soundbridge from '../../js/soundbridge';
import getSettings from './settings';
import styles from '../../style/bridge.scss';

const SelectSetting = props => {
    return (
        <div >
            <h3>Setting Number</h3>
            <Number
                min={0}
                max={30}
                onChange={props.handleChange}
            />
        </div>
    );
}
const SoloBox = props => {
    let soloClass = 'notification';
    if (!props.solo) soloClass += ' hidden';
    return (
        <div className={soloClass}>
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
            settings: false,
            settingNumber: 0,
            solo: false,
        };

        this.changeSettings = this.changeSettings.bind(this);
        this.startWithSettings = this.startWithSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
    }

    startWithSettings(ws, i) {
        console.info('startWithSettings');
        const settings = getSettings(i);
        console.info('settings: ', settings);
        this.setState({settings, settingNumber: i});
        // soundbridge(settings, ws, this.openConnection);
    }

    soloStart() {
        this.setState(() => ({solo: true}));
        const i = Math.floor(Math.random() * 29);
        const ws = {};
        ws.on = (a,b) => {};
        this.startWithSettings(ws, i);
    }

    changeSettings(n) {
        this.setState(() => ({ settings: getSettings(n), settingNumber: n }));
    }

    componentDidMount() {
        window.globalAudioContext = new window.AudioContext();
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

    handleAudioOn() {
        
    }

    render() {
        return (
            <div class="soundbridge">
                <SelectSetting
                    value={this.state.settingNumber}
                    handleChange={this.changeSettings}
                />

                <SoloBox solo={this.state.solo} />
                <Button onChange={this.handleAudioOn} />

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
