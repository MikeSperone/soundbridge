import { h, Component } from 'preact';

class Sensor extends Component {
    constructor(props) {
        super(props);
        const audioPath = '/audio';
        this.name = props.name;
        this.audio = `${audioPath}/${props.sample}.mp3`;
        this.synth = props.synth;
        this.onLoadAudio = props.onLoadAudio;
        this.onMove = props.onMove;
        this.handleMotion = this.handleMotion.bind(this);

        this.state = {
            value: 0
        };
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        this.synth = new this.synth(this.audio, globalAudioContext);
        this.synth.loadAudio()
            .then(() => this.onLoadAudio(this.synth));
    }

    handleMotion(e) {
        const value = e.offsetX + 1;
        const rate = value/270;
        this.setState(() => ( {value }));
        this.onMove(value, rate);
    }

    render() {
        return (
            <div
                className={"sensor"}
                id={this.name}
                onMouseEnter={this.props.onEnter}
                onMouseMove={this.handleMotion}
                onMouseLeave={this.props.onExit}
            >
                <div class="value">{this.state.value}</div>
            </div>
        );
    }
}

export default Sensor;
