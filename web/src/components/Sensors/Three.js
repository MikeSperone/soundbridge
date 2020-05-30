import { h, Component } from 'preact';
import Sensor from './Sensor';
import Loop from 'synths/loop';
import Play from 'synths/play';


//TODO: make this extend sensor?
export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="three";
        this.timeout = null;

        this.time = 0;
        this.position = 0;

        this.sample = this.props.sample;
        this.delaySettings = this.props.delay;
        this.grainSettings = this.props.grain;

        // TODO: make delayOn a button
        this.state = {
            delayOn: true
        };
        this.bind.call(this);
    }

    bind() {
        this.setSettings = this.setSettings.bind(this);
        this.handleLoadAudio = this.handleLoadAudio.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        this.setSettings(this.props.settings);
    }

    shouldComponentUpdate(props) {
        return this.setSettings(props.settings);
    }

    setSettings(settings) {
        if (!settings) return false;
        this.sample = settings.samples[3];
        this.delaySettings = settings.delay[3];
        this.grainSettings = settings.grain;

        this.playbackHold = new Play(`/audio/hold/${this.sample}_slow.mp3`, globalAudioContext);
        this.playbackHold.loadAudio().then(() => this.playbackHoldReady = true);
        return true;
    }

    handleLoadAudio(synth) {
        this.synth = synth;
        this.synth.scatter = this.grainSettings[0];
        this.synth.fade = this.grainSettings[1];
        this.synth.spread = this.grainSettings[2];
        this.synth.feedback = this.grainSettings[3];
    }

    handleEnter() {
        clearTimeout(this.timeout);
    }

    handleExit() {
        this.timeout = setTimeout(() => {
            this.synth.stop();
            this.playbackHold.stop();
        }, 5000);
        this.position = 0;
    }

    handleMove(value, _) {
        if (value > 231) {
            // Position 3
            console.log('entered 3.  From ' + this.position);
            if (this.position === 2) { this.playbackHold.stop(); }
            this.position = 3;
            this.synth.sensor(value / 11);

        } else if (value < 121) {
            // Position 1
            console.log('entered 1.  From ' + this.position);
            if (this.position !== 1) {

                this.time = (this.position === 2) ?
                    this.playbackHold.elapsedTime / 4 :
                    this.time;
                this.playbackHold.stop();
                this.position = 1;
                this.synth.sensor(value / 11, this.time);

            }

        } else {
            // Position 2
            console.log('entered 2.  From ' + this.position);
            if (this.position !== 2) {
                this.time = (this.position === 1) ?
                    this.synth.elapsedTime * 4 :
                    this.time;
                if (this.position !== 0) { this.synth.stop(); }
                this.position = 2;
                this.playbackHold.changeVolume(1, 0.01);
                this.playbackHold.startSample(this.time);
            }

        }

    }

    render() {
        return (
            this.sample ?
                <Sensor
                    name={this.name}
                    settings={{
                        sample: this.sample,
                        delay: this.delaySettings,
                        grain: this.grainSettings
                    }}
                    synth={Loop}
                    onEnter={this.handleEnter}
                    onMove={this.handleMove}
                    onExit={this.handleExit}
                    onLoadAudio={this.handleLoadAudio}
                /> :
                null
        );
    }
}
