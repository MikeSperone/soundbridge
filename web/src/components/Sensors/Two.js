import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgrain from 'synths/playgrain';


//TODO: make this extend sensor?
export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="two";
        this.timeout = null;

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
        this.context = window.globalAudioContext;
        this.setSettings(this.props.settings);
    }

    shouldComponentUpdate(props) {
        return this.setSettings(props.settings);
    }

    setSettings(settings) {
        if (!settings) return false;
        this.sample = settings.samples[2];
        // this.delaySettings = settings.delay[2];
        this.grainSettings = settings.grain[2];
        return true;
    }

    handleLoadAudio(synth) {
        console.info(this.name, 'Audio Loaded');
        this.synth = synth;
        this.synth.scatter = this.grainSettings[0];
        this.synth.fade = this.grainSettings[1];
        this.synth.spread = this.grainSettings[2];
        this.synth.feedback = this.grainSettings[3];
    }

    handleEnter() {
        console.log(this.name, 'Enter')
        clearTimeout(this.timeout);
        this.synth.start();
    }

    handleExit() {
        console.log(this.name, 'Exit')
        //TODO: can't I pass in a time here? to stop it after a certain time?
        this.timeout = setTimeout(() => this.synth.stop(), 5000);
    }

    handleMove(value, rate) {
        console.log(this.name, 'Move Hand');
        // range: 0 - 1
        this.synth.read = value/360;
    }

    render() {
        console.info(this.name, 'rendering');
        return (
            this.sample ?
                <Sensor
                    name={this.name}
                    sample={this.sample}
                    synth={Playgrain}
                    onEnter={this.handleEnter}
                    onMove={this.handleMove}
                    onExit={this.handleExit}
                    onLoadAudio={this.handleLoadAudio}
                /> :
                null
        );
    }
}
