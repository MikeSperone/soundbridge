import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgroove from 'synths/playgroove';

export default class One extends Component{

    constructor(props) {
        super(props);
        this.props = props;
        this.name = "one";
        this.synth = {};
        this.state = {
            synthLoaded: false,
        };
        this._bind.call(this);
    }

    _bind() {
        this.handleLoadAudio = this.handleLoadAudio.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    handleLoadAudio(s) {
        this.synth = s;
        this.synth.delaySwitch(this.props.settings.delay);
        this.setState(() => ({synthLoaded:true}));
    }

    handleEnter() {
        this.state.synthLoaded &&
            (this.synth.isMuted() || this.synth.changeVolume(0.7, 0.5));
    }

    handleExit() {
        this.synth.changeVolume(0.0, 5.0);
    }

    handleMove(value) {
        if (this.state.synthLoaded) {
            // Value is 0.0 - 1.0
            this.synth.pbRate(value);
            this.synth.delTime(value);
            this.synth.delFeedback(value);
        }
    }

    render() {
        return <Sensor
            name={this.name}
            synth={Playgroove}
            settings={this.props.settings}
            onEnter={this.handleEnter}
            onMove={this.handleMove}
            onExit={this.handleExit}
            onLoadAudio={this.handleLoadAudio}
        />;
    }
}
