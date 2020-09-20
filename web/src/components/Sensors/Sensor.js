import { h, createRef, Component } from 'preact';
import debounce from 'lodash.debounce';
import Socket from 'context/Socket';
import Button from 'components/Controls/Button';
import SettingsBox from 'components/Controls/SettingsBox';
import SensorControls from 'components/Controls/SensorControls';

const audioPath = '/audio';

const SensorContainer = props => <div className="sensor-container">{props.children}</div>;
const MessageBox = props => <div className="message-box">{props.message}</div>;
const AudioError = props => <span className="audio-error" >
        {(props.show ? "Error: Audio not loaded" : "")}
    </span>;


class Sensor extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.name = props.name;
        this.ws = props.socket;

        this.width = 0;

        const userName = 'user';
        this.sensorData = { name: this.name, source: userName };
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
        this.ws.on('data', d =>  (d.name === this.name) && this.handleMotion(d.position));
        this.ws.on('enter', d => (d.name === this.name) && this.handleEnter());
        this.ws.on('exit', d =>  (d.name === this.name) && this.handleExit());
    }

    ref = createRef();

    _bind() {
        this.resize = this.resize.bind(this);
        this.loadSynth = this.loadSynth.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleMotion = this.handleMotion.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
            console.info('Error loading audio: ', e);
            this.setState(() => ({ audioError: true }));
        }
    }

    handleEnter() {
        this.props.onEnter();
        this.setState(() => ({active: true}));
    }

    handleMouseEnter(e) {
        this.handleEnter();
        this.ws.emit('enter', this.sensorData);
    }

    handleMotion(position) {
        // multiplying to scale the 0. - 1. to our sensor width.
        const value = position * this.width;
        this.setState(() => ( { value }));
        this.props.onMove(position);
    }

    handleMouseMove(e) {
        const value = e.offsetX + 1;
        const position = value / this.width;
        // dividing to get 0. - 1. position value, so that the 
        // remote user can scale that to the width of their sensors.
        this.handleMotion(position);
        this.ws.emit('data', { ...this.sensorData, position });
    }

    handleExit() {
        this.props.onExit();
        this.setState(() => ({active: false}));
    }

    handleMouseLeave() {
        this.handleExit();
        this.ws.emit('exit', this.sensorData);
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
                    onMouseEnter={this.handleMouseEnter}
                    onMouseMove={this.handleMouseMove}
                    onMouseLeave={this.handleMouseLeave}
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

export default function SocketedSensor(props) {
    return <Socket.Consumer>
        {socket => <Sensor {...props } socket={socket} />}
    </Socket.Consumer>;
};
