import { h, Component } from 'preact';
import { Zero, One, Two, Three } from '../../components/Sensors';
import XYPad from '../../components/XYPad';
import { Number } from 'react-nexusui';

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
class Soundbridge extends Component {

    constructor() {
        super();
        this.openConnection = false;

        this.startWithSettings = this.startWithSettings.bind(this);
        this.soloStart = this.soloStart.bind(this);
        this.state = {
            settings: false,
            settingNumber: 0,
        };
        this.changeSettings = this.changeSettings.bind(this);
    }

    startWithSettings(ws, i) {
        console.info('startWithSettings');
        const settings = getSettings(i);
        console.info('settings: ', settings);
        this.setState({settings, settingNumber: i});
        // soundbridge(settings, ws, this.openConnection);
    }

    soloStart() {
        const soloBox = document && document.getElementById('solo-box');
        if (!!soloBox) soloBox.style = 'display: block';
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

                // <XYPad />
    render() {
        return (
            <div class="soundbridge">
                <SelectSetting
                    value={this.state.settingNumber}
                    handleChange={this.changeSettings}
                />

                {this.state.settings && (
                    <div>
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
                    </div>
                )}

            </div>
        );
    }
}

export default Soundbridge;
