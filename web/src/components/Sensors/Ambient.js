import { h, Component } from 'preact';
import Play from 'synths/play';
import audioPath from './audioPath';

class Ambient extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.sample = this.props.sample;
        console.info('Ambient Sound loading');
        if (!window.globalAudioContext) return;
        this.p = new Play(globalAudioContext, 1.0);
        this.loadSynth = this.loadSynth.bind(this);
        this.loadSynth();
    }

    loadSynth() {
        console.info('Ambient - loading synth');
        if (!this.sample) {
            console.info('no sample');
            return;
        }
        console.info('new sample found');
        const audio = `${audioPath}/${this.sample}.mp3`;
        console.info('Ambient sound: ', audio);
        this.p.loadAudio(audio).then(() => this.p.startSample());
    }

    componentDidUpdate(prevProps) {
        // Check if it's a new sample
        if (prevProps.sample !== this.props.sample) {
            console.info('checking if Ambient component sample changed');
            console.info('this.props: ', this.props);
            console.info('this.props.sample: ', this.props.sample);
            console.info('this.sample: ', this.sample);
            console.info('prevProps.sample: ', prevProps.sample);
            console.info('Ambient component did update');
            this.sample = this.props.sample;
            if (this.p.stop) {
                console.info('play.stop exists, stopping');
                this.p.stop();
            }
            this.loadSynth();
        }
    }

    render() {
        return <div id="ambient"></div>;
    }
}

export default Ambient;
