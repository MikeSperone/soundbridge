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
        this.p = new Play(globalAudioContext, 1.0);
        this.loadSynth = this.loadSynth.bind(this);
        this.loadSynth();
    }

    loadSynth() {
        if (!this.sample) return;
        const audio = `${audioPath}/${this.sample}.mp3`;
        console.info('Ambient sound: ', audio);
        if (this.sample.length) {
            this.p.loadAudio(audio).then(() => this.p.startSample());
        }
    }

    componentDidUpdate(prevProps) {
        // Check if it's a new sample
        if (this.props.sample !== prevProps.sample) {
            this.sample = this.props.sample;
            this.p.stop();
            this.loadSynth();
        }
    }

    render() {
        return <div id="ambient"></div>;
    }
}

export default Ambient;
