import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgrain from 'synths/playgrain';


export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="two";
        this.timeout = null;

        this.sample = this.props.sample;
        this.delaySettings = this.props.delay;
        this.grainSettings = this.props.grain;

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
        // TODO: is this necessary?
        // return this.setSettings(props.settings);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    setSettings(settings) {
        if (!settings) return false;
        this.sample = settings.samples[2];
        this.grainSettings = settings.grain;
        // Sensor 2 delay settings is always false
        this.delaySettings = settings.delay[2];
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
        this.synth.start();
    }

    handleExit() {
        //TODO: can't I pass in a time here? to stop it after a certain time?
        this.timeout = setTimeout(() => this.synth.stop(), 5000);
    }

    handleMove(value, rate) {
        // range: 0 - 1
        this.synth.read = value;
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
