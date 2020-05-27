import { h, Component } from 'preact';
import { Slider } from 'react-nexusui';

const SensorContainer = (props) => <div className="sensor-container">{props.children}</div>;

const MessageBox = props => <div className="message-box">{props.message}</div>;

class Sensor extends Component {
    constructor(props) {
        super(props);
        const audioPath = '/audio';
        this.props = props;
        this.name = props.name;
        this.audio = `${audioPath}/${props.sample}.mp3`;
        this.synth = props.synth;
        this.onLoadAudio = props.onLoadAudio;

        this.handleMotion = this.handleMotion.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.setVolumeScalar = this.setVolumeScalar.bind(this);

        this.state = {
            value: 0,
            isMuted: false,
            active: false
        };
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        this.synth = new this.synth(this.audio, globalAudioContext);
        this.synth.mute = this.handleMute.bind(this);
        this.synth.isMuted = () => this.state.isMuted;
        this.synth.loadAudio()
            .then(() => this.onLoadAudio(this.synth));
    }

    componentWillUnmount() {
        // destroy synth
    }
    handleEnter(e) {
        console.info(this.name, 'Enter');
        this.props.onEnter(e);
        this.setState(() => ({active: true}));
    }

    handleMotion(e) {
        const value = e.offsetX + 1;
        const rate = value/270;
        this.setState(() => ( {value }));
        this.props.onMove(value, rate);
    }

    handleExit() {
        console.info(this.name, 'Exit');
        this.props.onExit();
        this.setState(() => ({active: false}));
    }

    handleMute() {
        console.info(this.state.isMuted ? 'unmuting' : 'muting', this.name);
        const vol = (this.state.isMuted) ? this.synth.vol : 0;
        this.synth.changeVolume(vol, 0.2);
        this.setState(state => ({isMuted: !state.isMuted}));
    }

    setVolumeScalar(v) {
        this.synth.volumeScalar = v;
    }

    render() {
        return (
            <SensorContainer>
                <div
                    className={"sensor " + (this.state.active ? "active" : "inactive")}
                    id={this.name}
                    onMouseEnter={this.handleEnter}
                    onMouseMove={this.handleMotion}
                    onMouseLeave={this.handleExit}
                >
                    <span class="value">{this.state.value}</span>
                </div>
                <button
                    class={this.state.isMuted ? "muted" : "mute"}
                    onClick={this.handleMute}
                >
                    M
                </button>
                <Slider
                    size={[18,48]}
                    mode="absolute"
                    min={0}
                    max={1.0}
                    value={1.0}
                    onChange={this.setVolumeScalar}
                />
                <MessageBox message={this.state.message} />
            </SensorContainer>
        );
    }
}

export default Sensor;
