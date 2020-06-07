import { h, Component } from 'preact';
import Slider from 'components/Controls/Slider';
import Button from 'components/Controls/Button';
import SettingsBox from 'components/Controls/SettingsBox';

const SensorContainer = props => <div className="sensor-container">{props.children}</div>;

const MessageBox = props => <div className="message-box">{props.message}</div>;

const TestValues = props => (
    <div className="">
        <ul>
            <li>audioLoaded: {props.audioLoaded ? '√' : 'x'}</li>
        </ul>
    </div>
);

const SensorControls = props => {
    return (
        <div className="sensor-controls">
            <button
                className={props.muted ? "muted" : "mute"}
                onClick={props.handleMute}
            >M</button>
            <Slider
                size={[18,64]}
                mode="absolute"
                min={0}
                max={1.0}
                value={1.0}
                onChange={props.handleVolume}
            />
        </div>
    );
}

class Sensor extends Component {
    constructor(props) {
        super(props);
        const audioPath = '/audio';
        this.props = props;
        this.name = props.name;
        this.audio = `${audioPath}/${props.settings.sample}.mp3`;
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
            active: false,
            message: '',
            audioLoaded: false,
            showSettings: true,
        };
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        this.synth = new this.synth(this.audio, globalAudioContext);
        console.info('Synth ', this.synth);
        this.synth.mute = this.handleMute.bind(this);
        this.synth.isMuted = () => this.state.isMuted;
        this.synth.loadAudio()
            .then(() => {
                this.setState(() => ({ audioLoaded: true }));
                this.onLoadAudio(this.synth);
            });
        this.setListeners();
    }

    componentWillUnmount() {
        this.synth.destroy();
        // destroy synth
    }

    setListeners() {
        window.addEventListener('sensor-settings', this.setSettings.bind(this));
    }

    setSettings(settings) {
        this.setState(() => settings);
    }

    handleEnter(e) {
        this.props.onEnter(e);
        this.setState(() => ({active: true}));
    }

    handleMotion(e) {
        const value = e.offsetX + 1;
        const rate = value/270;
        this.setState(() => ( { value }));
        this.props.onMove(value, rate);
    }

    handleExit() {
        this.props.onExit();
        this.setState(() => ({active: false}));
    }

    handleMute() {
        const vol = (this.state.isMuted) ? this.synth.vol : 0;
        this.synth.changeVolume(vol, 0.2);
        this.setState(state => ({isMuted: !state.isMuted}));
    }

    setVolumeScalar(v) {
        this.synth.volumeScalar = v;
    }

    render() {
        return (
            <SensorContainer active={this.state.audioLoaded}>
                <div
                    className={"sensor " + (this.state.active ? "active" : "inactive")}
                    id={this.name}
                    onMouseEnter={this.handleEnter}
                    onMouseMove={this.handleMotion}
                    onMouseLeave={this.handleExit}
                >
                    <span class="bar" style={{left: this.state.value}}></span>
                    <span class="value">{this.state.value}</span>
                </div>
                <SensorControls
                    muted={this.state.isMuted}
                    handleMute={this.handleMute}
                    handleVolume={this.setVolumeScalar}
                />
                <SettingsBox show={this.state.showSettings} settings={this.props.settings} />
                <TestValues audioLoaded={this.state.audioLoaded} />
            </SensorContainer>
        );
    }
}

export default Sensor;
