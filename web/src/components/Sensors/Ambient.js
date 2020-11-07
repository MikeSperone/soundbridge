import { h, Component } from 'preact';
import Ambient from 'synths/ambient';

export default class AmbientSound extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.info('Ambient Sound loading');
        console.info('Ambient sound: ', props.sample);
        if (!window.globalAudioContext) return;
        if (props.sample !== "") {
            const ambient = new Ambient(props.sample, globalAudioContext);
        }

    }

    render() {
        return <div>hi</div>;
    }
}

export default AmbientSound;
