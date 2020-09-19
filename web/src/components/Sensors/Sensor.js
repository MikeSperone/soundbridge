import { h, createRef, Component } from 'preact';
import debounce from 'lodash.debounce';
import Button from 'components/Controls/Button';
import SettingsBox from 'components/Controls/SettingsBox';
import SensorControls from 'components/Controls/SensorControls';

const audioPath = '/audio';

const SensorContainer = props => <div className="sensor-container">{props.children}</div>;
const MessageBox = props => <div className="message-box">{props.message}</div>;
const AudioError = props => <span
        className="audio-error"
    >
        {(props.show ? "Error: Audio not loaded" : "")}
    </span>;


class Sensor extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.name = props.name;

        this.width = 0;

        this.state = {
            value: 0,
            isMuted: false,
            active: false,
            message: '',
            audioLoaded: false,
            audioError: false,
            showSettings: false,
        };

        this._bind();
    }

    ref = createRef();

    _bind() {
        this.resize = this.resize.bind(this);
        this.loadSynth = this.loadSynth.bind(this);
        this.handleMotion = this.handleMotion.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.setVolumeScalar = this.setVolumeScalar.bind(this);
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        if (window && window.location.search && window.location.search.match(/(\?|&)settings/)) {
            this.setState(() => ({ showSettings: true }));
        }

        window.addEventListener('resize', () => debounce(this.resize, 500));
        this.resize();
        this.loadSynth();
    }

    componentDidUpdate(prevProps) {
        // Check if it's a new sample
        if (this.props.settings.index !== prevProps.settings.index) {
            this.loadSynth();
        }
    }

    componentWillUnmount() {
        this.synth.destroy();
        // destroy synth
    }

    resize() {
        this.width = this.ref.current.getBoundingClientRect().width;
    }

    loadSynth() {
        const audio = `${audioPath}/${this.props.settings.sample}.mp3`;

        // Set Synth
        this.synth = new this.props.synth(audio, globalAudioContext);
        this.synth.mute = this.handleMute;
        this.synth.isMuted = () => this.state.isMuted;

        try {
            this.synth.loadAudio()
                .then(() => {
                    this.setState(() => ({ audioLoaded: true }));
                    this.props.onLoadAudio(this.synth);
                });
        } catch (e) {
            console.info(e);
            this.setState(() => ({ audioError: true }));
        }
    }

    handleEnter(e) {
        this.props.onEnter(e);
        this.setState(() => ({active: true}));
    }

    handleMotion(e) {
        const value = e.offsetX + 1;
        const rate = value/this.width;
        this.setState(() => ( { value }));
        this.props.onMove(rate);
    }

    handleExit() {
        this.props.onExit();
        this.setState(() => ({active: false}));
    }

    handleMute() {
        const vol = (this.state.isMuted) ? this.synth.vol : 0;
        console.info("vol: ", vol);
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
                    ref={this.ref}
                    onMouseEnter={this.handleEnter}
                    onMouseMove={this.handleMotion}
                    onMouseLeave={this.handleExit}
                >
                    <span class="bar" style={{left: this.state.value}}></span>
                    <span class="value">{this.state.value}</span>
                    <AudioError show={this.state.audioError}/>
                </div>
                <SensorControls
                    muted={this.state.isMuted}
                    handleMute={this.handleMute}
                    handleVolume={this.setVolumeScalar}
                />
                <SettingsBox show={this.state.showSettings} settings={this.props.settings} />
            </SensorContainer>
        );
    }
}

export default Sensor;
