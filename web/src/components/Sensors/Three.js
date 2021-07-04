import { h, Component } from 'preact';
import Sensor from './Sensor';
import Loop from 'synths/loop';
import Play from 'synths/play';
import audioPath from './audioPath';

const log = m => console.log('[Three] ', m);

const ONE_THIRD = 1 / 3;
const TWO_THIRDS =  2 / 3;

export default class Three extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="three";
        this.synth = null;
        this.holdSynth = null;
        this.position = 0;
        this.time = 0;
        this.timeout = null;
        this.state = {
            synthLoaded: false,
            holdSynthReady: false,
        };
        this._bind.call(this);
    }

    _bind() {
        this.handleLoadAudio = this.handleLoadAudio.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.stopHold=this.stopHold.bind(this);
        this.firstPosition=this.firstPosition.bind(this);
        this.secondPosition=this.secondPosition.bind(this);
        this.thirdPosition=this.thirdPosition.bind(this);
    }

    handleLoadAudio(s) {
        log('audio loaded');
        this.synth = s;
        this.synth.scatter = this.props.settings.grain[0];
        this.synth.fade = this.props.settings.grain[1];
        this.synth.spread = this.props.settings.grain[2];
        this.synth.feedback = this.props.settings.grain[3];
        this.setState(() => ({synthLoaded:true}));

        this.holdSynth = new Play(window.globalAudioContext);
        this.holdSynth.loadAudio(`${audioPath}/hold/${this.props.settings.sample}_slow.mp3`)
            .then(() => this.setState(() => ({holdSynthReady: true})));
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
        return (this.position === 2) && this.holdSynth.stop();
    }

    firstPosition(value) {
        // Position 1
        // TODO: need a better equation for a properly scaled filter
        const filterValue = Math.pow((1.0 - (3 * value)), 1.8) * 15000 + 200;
        if (this.position !== 1) {
            log('entered 1.  From ' + this.position);

            this.time = (this.position === 2) ?
                this.holdSynth.elapsedTime / 4 :
                this.time;
            this.stopHold();

            this.position = 1;

            this.synth.changeFilter(filterValue)
            this.synth.changeVolume(1);

            this.synth.playAll(this.time);
        } else {
            this.synth.changeFilter(filterValue);
        }
    }

    secondPosition() {
        // Position 2
        if (this.position !== 2) {
            log('You have entered 2.  From ' + this.position);
            if (this.position === 1) {
                this.time = this.synth.elapsedTime * 4;
                this.synth.changeFilter(0);
            } else {
                this.time = this.time;
            }
            if (this.position !== 0) this.synth.stop();
            this.holdSynth.changeVolume(1);
            this.holdSynth.startSample(this.time);
            this.position = 2;
        }
    }

    thirdPosition(value) {
        if (this.position !== 3) log('entered 3.  From ' + this.position);
        if (this.position === 1) this.synth.changeFilter(0);
        this.stopHold();
        this.position = 3;
        // const scaledValue = (0.6 * value) - 0.9;
        // const scaledValue = (2 * value) - 1.035;
        const scaledValue = (3 * value) - 2;
        this.synth.changeVolume(1);
        this.synth.sensor(scaledValue);
    }

    handleMove(value) {
        if (!this.state.synthLoaded) return;
        if (value >= TWO_THIRDS) {
            this.thirdPosition(value);
        } else if (value >= ONE_THIRD) {
            this.secondPosition();
        } else {
            this.firstPosition(value);
        }
    }

    render() {
        return <Sensor
            name={this.name}
            synth={Loop}
            settings={this.props.settings}
            onEnter={this.handleEnter}
            onMove={this.handleMove}
            onExit={this.handleExit}
            onLoadAudio={this.handleLoadAudio}
        />;
    }
}
