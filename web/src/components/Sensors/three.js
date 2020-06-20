import { h, Component } from 'preact';
import Sensor from './Sensor';
import Loop from 'synths/loop';
import Play from 'synths/play';

const log = m => console.log('[Three] ', m);

export default class Three extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="three";
        this.timeout = null;
        this.synth = null;

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
        this.firstPosition = this.firstPosition.bind(this);
        this.secondPosition = this.secondPosition.bind(this);
        this.thirdPosition = this.thirdPosition.bind(this);
        this.stopHold = this.stopHold.bind(this);
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

        this.holdSynth = new Play(`/audio/hold/${this.sample}_slow.mp3`, globalAudioContext);
        return true;
    }

    handleLoadAudio(synth) {
        log('audio loaded');
        console.info('synth: ', synth);
        this.synth = synth;
        this.synth.scatter = this.grainSettings[0];
        this.synth.fade = this.grainSettings[1];
        this.synth.spread = this.grainSettings[2];
        this.synth.feedback = this.grainSettings[3];
        this.holdSynth.loadAudio().then(() => this.holdSynthReady = true);
    }

    handleEnter() {
        clearTimeout(this.timeout);
    }

    handleExit() {
        this.timeout = setTimeout(() => {
            this.synth.stop();
            this.holdSynth.stop();
            this.position = 0;
        }, 5000);
    }

    stopHold() {
        if (this.position === 2) {
            log('stopHold');
            this.holdSynth.stop();
        }
    }

    firstPosition() {
        // Position 1
        if (this.position !== 1) {
            log('entered 1.  From ' + this.position);

            this.time = (this.position === 2) ?
                this.holdSynth.elapsedTime / 4 :
                this.time;
            this.stopHold();

            this.position = 1;
            this.synth.changeVolume(1);
            this.synth.playAll(this.time);
        }
    }

    secondPosition() {
        // Position 2
        if (this.position !== 2) {
            log('You have entered 2.  From ' + this.position);
            this.time = (this.position === 1) ?
                this.synth.elapsedTime * 4 :
                this.time;
            // TODO: I guess I need this line, but it's breaking
            if (this.position !== 0) { this.synth.stop(); }
            this.holdSynth.changeVolume(1);
            this.holdSynth.startSample(this.time);
            this.position = 2;
        }
    }

    thirdPosition(value) {
        if (this.position !== 3) log('entered 3.  From ' + this.position);
        this.stopHold();
        this.position = 3;
        // const scaledValue = (0.6 * value) - 0.9;
        const scaledValue = (2 * value) - 1.035;
        this.synth.changeVolume(1);
        this.synth.sensor(scaledValue);
    }

    handleMove(value) {
        if (value > 0.666666666) {
            this.thirdPosition(value);
        } else if (value > 0.333333333) {
            this.secondPosition();
        } else {
            this.firstPosition();
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
