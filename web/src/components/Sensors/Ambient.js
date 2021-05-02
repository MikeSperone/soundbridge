import { h, Component } from 'preact';
import Play from 'synths/play';
import audioPath from './audioPath';

class Ambient extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.sample = this.props.sample;
        console.info('Ambient Sound loading');
        if (!window.globalAudioContext || !props.sample) return;
        this.loadSynth = this.loadSynth.bind(this);
        this.loadSynth();
    }
    loadSynth() {
        const audio = `${audioPath}/${this.sample}.mp3`;
        console.info('Ambient sound: ', audio);
        this.p = new Play(audio, globalAudioContext, 1.0);
        if (this.sample.length) {
            this.p.loadAudio().then(() => this.p.startSample());
        }
    }
    componentDidUpdate(prevProps) {
        // Check if it's a new sample
        if (this.props.sample !== prevProps.sample) {
            this.sample = this.props.sample;
            this.loadSynth();
        }
    }
    render() {
        return <div id="ambient"></div>;
    }
}

export default Ambient;
