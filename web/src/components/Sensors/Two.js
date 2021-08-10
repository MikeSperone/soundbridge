import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgrain from 'synths/playgrain';

export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="two";
        this.controlParameterNames = ['delays', 'spread','feedback','fade','scatter', 'scaleToSettings'];
        this.state = {
            synthLoaded: false,
            useSpread: false,
            useFeedback: false,
            useFade: false,
            useScatter: false,
        };

        this.synth = null;
        this.timeout = null;

        this.bind.call(this);
    }

    bind() {
        this.handleLoadAudio = this.handleLoadAudio.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.setSynthValue = this.setSynthValue.bind(this);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    handleLoadAudio(synth) {
        this.synth = synth;
        this.synth.scatter = this.props.settings.grain[0];
        this.synth.fade = this.props.settings.grain[1];
        this.synth.spread = this.props.settings.grain[2];
        this.synth.feedback = this.props.settings.grain[3];
        this.setState(() => ({synthLoaded:true}));
    }

    handleEnter() {
        if (this.state.synthLoaded) {
            clearTimeout(this.timeout);
            this.synth.isPlaying || this.synth.start();
            this.synth.isMuted() || this.synth.changeVolume(0.7, 0.5);
        }
    }

    handleExit() {
        if (!this.synth) return;
        this.synth.changeVolume(0, 5.0);
        this.timeout = setTimeout(() => this.synth.stop(), 5010);
    }

    setSynthValue(activeControls, value, controlName, g, offset=0) {
        if (activeControls[controlName]) {
            const scaledSetting = activeControls.scaleToSettings ? g : 1;
            this.synth[controlName] = (value * scaledSetting) + offset;
        } else {
            this.synth[controlName] = g;
        }
    }

    handleMove(value, activeControls) {
        if (!this.synth) return;
        // range: 0 - 1
        this.setSynthValue(activeControls, value, 'spread', this.props.settings.grain[2]);
        this.setSynthValue(activeControls, value, 'feedback', this.props.settings.grain[3]);
        this.setSynthValue(activeControls, value, 'fade', this.props.settings.grain[1]);
        this.setSynthValue(activeControls, value, 'scatter', this.props.settings.grain[0]);
        // setSynthValue('delays', 0.5, 0.05);
        this.synth.read = value;
    }

    render() {
        return <Sensor
            name={this.name}
            synth={Playgrain}
            settings={this.props.settings}
            controls={this.controlParameterNames}
            onEnter={this.handleEnter}
            onMove={this.handleMove}
            onExit={this.handleExit}
            onLoadAudio={this.handleLoadAudio}
            volumeScaling={this.props.volumeScaling}
        />;
    }
}
