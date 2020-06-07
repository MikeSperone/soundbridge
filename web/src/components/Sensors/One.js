import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgroove from 'synths/playgroove';


//TODO: make this extend sensor?
export default class One extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="one";

        this.sample = this.props.sample;
        this.delaySettings = this.props.delay;
        this.grainSettings = this.props.grain;

        this.synth = null;
 
        // TODO: make delayOn a button
        this.state = {
            delayOn: true,
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
        // this.context = window.globalAudioContext;
        // this.setSettings(this.props.settings);
    }

    shouldComponentUpdate(props) {
        // return this.setSettings(props.settings);
    }

    setSettings(settings) {
        if (!settings) return false;
        this.sample = settings.samples[1];
        this.delaySettings = settings.delay[1];
        this.grainSettings = settings.grain;
        return true;
    }

    handleLoadAudio(synth) {
        this.synth = synth;
        this.synth.delaySwitch(this.delaySettings);
    }

    handleEnter() {
        this.synth.changeVolume(0.7, 0.5);
    }

    handleExit() {
        this.synth.changeVolume(0, 5.0);
    }

    handleMove(value) {
        this.synth.pbRate(value);
        if (this.state.delayOn) {
            this.synth.delTime((value * 0.7) + 0.125);      // range of .125 - .825(s)
            this.synth.delFeedback((value * 0.42) + 0.075);  // range of .075 - .495
        }
    }

    render() {
        return (
            this.sample ?
                <Sensor
                    name={this.name}
                    synth={Playgroove}
                    settings={{
                        sample: this.sample,
                        delay: this.delaySettings,
                        grain: this.grainSettings
                    }}
                    onEnter={this.handleEnter}
                    onMove={this.handleMove}
                    onExit={this.handleExit}
                    onLoadAudio={this.handleLoadAudio}
                /> :
                null
        );
    }
}
