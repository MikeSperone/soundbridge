import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgrain from 'synths/playgrain';

export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="two";

        this.settings = this.props.settings;

        this.synth = null;
        this.timeout = null;

        this.bind.call(this);
    }

    bind() {
        this.handleLoadAudio = this.handleLoadAudio.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    handleLoadAudio(synth) {
        this.synth = synth;
        this.synth.scatter = this.settings.grain[0];
        this.synth.fade = this.settings.grain[1];
        this.synth.spread = this.settings.grain[2];
        this.synth.feedback = this.settings.grain[3];
    }

    handleEnter() {
        clearTimeout(this.timeout);
        this.synth.start();
    }

    handleExit() {
        this.timeout = setTimeout(() => this.synth.stop(), 5000);
    }

    handleMove(value) {
        // range: 0 - 1
        this.synth.read = value;
    }

    render() {
        return (
            this.settings.sample ?
                <Sensor
                    name={this.name}
                    synth={Playgrain}
                    settings={this.settings}
                    onEnter={this.handleEnter}
                    onMove={this.handleMove}
                    onExit={this.handleExit}
                    onLoadAudio={this.handleLoadAudio}
                /> :
                null
        );
    }
}
