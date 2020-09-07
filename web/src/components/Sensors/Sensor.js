import { h, createRef, Component } from 'preact';
import debounce from 'lodash.debounce';
import Button from 'components/Controls/Button';
import SettingsBox from 'components/Controls/SettingsBox';
import SensorControls from 'components/Controls/SensorControls';

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
        const audioPath = '/audio';
        this.props = props;
        this.name = props.name;
        this.audio = `${audioPath}/${props.settings.sample}.mp3`;
        this.synth = props.synth;
        this.onLoadAudio = props.onLoadAudio;

        this.width = 0;
        this.resize = this.resize.bind(this);
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
            audioError: false,
            showSettings: false,
        };
    }

    ref = createRef();

    componentDidMount() {
        if (!window.globalAudioContext) return;
        if (window && window.location.search && window.location.search.match(/(\?|&)settings/)) {
            this.setState(() => ({ showSettings: true }));
        }

        window.addEventListener('resize', () => debounce(this.resize, 500));
        this.resize();

        // Set Synth
        this.synth = new this.synth(this.audio, globalAudioContext);
        this.synth.mute = this.handleMute.bind(this);
        this.synth.isMuted = () => this.state.isMuted;
        try {
            this.synth.loadAudio()
                .then(function() {
                    this.setState(() => ({ audioLoaded: true }));
                    this.onLoadAudio(this.synth);
                }.bind(this));
        } catch (e) {
            console.info(e);
            this.setState(() => ({ audioError: true }));
        }
    }

    componentWillUnmount() {
        this.synth.destroy();
        // destroy synth
    }

    resize() {
        this.width = this.ref.current.getBoundingClientRect().width;
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
