import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgrain from 'synths/playgrain';

export default class Two extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.name="two";


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
        this.synth.scatter = this.props.settings.grain[0];
        this.synth.fade = this.props.settings.grain[1];
        this.synth.spread = this.props.settings.grain[2];
        this.synth.feedback = this.props.settings.grain[3];
    }

    handleEnter() {
        if (!this.synth) return;
        clearTimeout(this.timeout);
        this.synth.start();
    }

    handleExit() {
        if (!this.synth) return;
        this.timeout = setTimeout(() => this.synth.stop(), 5000);
    }

    handleMove(value) {
        if (!this.synth) return;
        // range: 0 - 1
        this.synth.read = value;
    }

    render() {
        return <Sensor
            name={this.name}
            synth={Playgrain}
            settings={this.props.settings}
            onEnter={this.handleEnter}
            onMove={this.handleMove}
            onExit={this.handleExit}
            onLoadAudio={this.handleLoadAudio}
            volumeScaling={this.props.volumeScaling}
        />;
    }
}
