import { h, createRef, Component } from 'preact';
import PropTypes from 'prop-types';

import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import Socket from 'context/Socket';
import Solo from 'context/Solo';

import Button from 'components/Controls/Button';
import SettingsBox from 'components/Controls/SettingsBox';
import SensorControls from 'components/Controls/SensorControls';
import audioPath from './audioPath';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Form from 'react-bootstrap/Form';
// import Form.Check from 'react-bootstrap/Form.Check';

const DataTooltip = props => {

    const renderTooltip = (ttProps) => (
        <Tooltip id="sensor-tooltip" {...ttProps}>
        Here is a hint
        </Tooltip>
        
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400  }}
            overlay={renderTooltip}
        >
            {props.children}
        </OverlayTrigger>
    );
};


const SensorContainer = props => <div className="sensor-container">{props.children}</div>;
const MessageBox = props => <div id="message-box">{props.message}</div>;
const AudioError = props => <span className="audio-error" >
        {props.show ? "Error: Audio not loaded" : ""}
    </span>;
const debug = true;


class Sensor extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.name = props.name;
        this.ws = props.socket;
        this.solo = props.solo;

        this.controls = props.controls || [];
        this.width = 1;

        console.info(`settings for ${this.name}: ${this.props.settings}`);

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
            showControls: false,
            activeControls: {},
        };

        this.setState(s => {
            const activeControls = this.controls.reduce((acc,c) => ({...acc, [c]:false}), {});
            return {activeControls};
        });
        this._bind.call(this);
        if (this.props.volumeScalar && this.props.volumeScalar.length) {
            this.setVolumeScalar(this.props.volumeScalar[1]);
        }
        this.on('data', d =>  (d.name === this.name) && this.handleMotion(d.position));
        this.on('enter', d => (d.name === this.name) && this.handleEnter());
        this.on('exit', d =>  (d.name === this.name) && this.handleExit());
    }

    ref = createRef();

    _bind() {
        this.resize = this.resize.bind(this);
        this.loadSynth = this.loadSynth.bind(this);
        this.handleMute = this.handleMute.bind(this);
        this.handleMotion = this.handleMotion.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleThrottledMouseMove = throttle(this.handleThrottledMouseMove.bind(this),50);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleExit = this.handleExit.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.setVolumeScalar = this.setVolumeScalar.bind(this);
        this.emit = this.emit.bind(this);
        this.on = this.on.bind(this);
        this.debugLog = this.debugLog.bind(this);

        this.setControlState = this.setControlState.bind(this);
    }

    debugLog(msg) {
        if (!debug) return;
        const prefix = `[sensor ${this.name}]`;
        console.info(prefix, msg);
    }

    componentDidMount() {
        if (!window.globalAudioContext) return;
        if (window && window.location.search) {
            if (window.location.search.match(/(\?|&)settings/)) {
                this.setState(() => ({ showSettings: true }));
            }
            if (window.location.search.match(/(\?|&)control/)) {
                this.setState(() => ({ showControls: true }));
            }
        }

        window.addEventListener('resize', () => debounce(this.resize, 500));
        this.resize();
        this.loadSynth();
    }

    componentDidUpdate(prevProps) {
        // Check if it's a new sample
        this.debugLog('component did update');
        if (this.props.settings.sample !== prevProps.settings.sample) {
            this.debugLog('component found new settings');
            this.loadSynth();
        }
    }

    componentWillUnmount() {
        // this.synth.destroy();
        // destroy synth
    }

    resize() {
        this.width = this.ref.current.getBoundingClientRect().width;
    }

    loadSynth() {
        const audio = `${audioPath}/${this.props.settings.sample}.mp3`;
        this.debugLog('loading synth with audio ' + audio);

        // Set Synth
        this.synth = new this.props.synth(globalAudioContext);
        this.synth.mute = this.handleMute;
        this.synth.isMuted = () => this.state.isMuted;

        try {
            this.synth.loadAudio(audio)
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
        console.info('isPerformer?', this.props.isPerformer);
        if (!this.props.isPerformer) return;
        this.handleEnter();
        this.emit('enter', this.sensorData);
    }

    handleMotion(position) {
        // multiplying to scale the 0. - 1. to our sensor width.
        const value = position * this.width;
        this.setState(() => ( { value }));
        this.props.onMove(position, this.state.activeControls);
    }

    handleMouseMove(e) {
        if (!this.props.isPerformer) return;
        this.handleThrottledMouseMove(e.offsetX);
    }

    handleThrottledMouseMove(offsetX) {
        const value = offsetX + 1;
        const position = value / this.width;
        // dividing to get 0. - 1. position value, so that the
        // remote user can scale that to the width of their sensors.
        this.handleMotion(position);
        this.emit('data', { ...this.sensorData, position });
    };

    on(name, func) {
        if (this.solo) return;
        this.ws.on(name, func);
    }
    emit(name, data) {
        if (this.solo) return;
        this.ws.emit(name, data);
    }

    handleExit() {
        this.props.onExit();
        this.setState(() => ({active: false}));
    }

    handleMouseLeave() {
        if (!this.props.isPerformer) return;
        this.handleExit();
        this.emit('exit', this.sensorData);
    }

    handleMute() {
        const vol = (this.state.isMuted) ? this.synth.vol : 0;
        this.synth.changeVolume(vol, 0.2);
        this.setState(state => ({isMuted: !state.isMuted}));
    }

    setVolumeScalar(v) {
        this.synth.volumeScalar = v;
    }

    setControlState(name, checked) {
        this.setState(() => ({ activeControls: { [name]: checked }}));
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
                    <span class="bar" style={{left: this.state.value - 4}}></span>
                    <span class="value">{this.state.value}</span>
                    <AudioError show={this.state.audioError}/>
                </div>
                <SensorControls
                    muted={this.state.isMuted}
                    handleMute={this.handleMute}
                    handleVolume={this.setVolumeScalar}
                />
                <SettingsBox
                    show={this.state.showSettings}
                    settings={this.props.settings}
                />
                {this.state.showControls && this.controls ?
                    <Form>
                         {this.controls.map(c => {
                            return <Form.Check 
                                type={'checkbox'}
                                label={`${c}`}
                                onChange={e => this.setControlState(c, e.currentTarget.checked)}
                            />
                        })}
                    </Form> :
                    null
                }
            </SensorContainer>
        );
    }
}

Sensor.propTypes = {
    name: PropTypes.string,
    settings: {},
    isPerformer: PropTypes.bool,
};

export default function SocketedSensor(props) {
    return <Socket.Consumer>
        {socket => <SoloableSensor {...props } socket={socket} />}
    </Socket.Consumer>;
};
const SoloableSensor = props => (
    <Solo.Consumer>
        {({solo, isPerformer}) => (
            <Sensor
                { ...props }
                solo={solo}
                isPerformer={isPerformer}
            />
        )}
    </Solo.Consumer>
);
