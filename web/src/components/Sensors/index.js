import { h, Component } from 'preact';
import Solo from 'context/Solo';
import Ambient from './Ambient';
import Zero from './Zero';
import One from './One';
import Two from './Two';
import Three from './Three';

import getSettings from 'containers/soundbridge/settings';

class Sensors extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.settingNumber = props.settingNumber;
        this.settings = getSettings(props.settingNumber);
    }

    componentDidMount() {
        console.info('Sensors mounted');
    }

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (this.props.settingNumber !== nextProps.settingNumber) || nextProps.forceUpdate;
        console.info('previous settingNumber: ', this.props.settingNumber);
        console.info('next settingNumber: ', nextProps.settingNumber);
        console.info('force update: ', nextProps.shouldUpdate);
        console.info('should update... ', shouldUpdate);
        return shouldUpdate;
    }

    componentDidUpdate(prevProps) {
        this.settingNumber = this.props.settingNumber;
        this.settings = getSettings(this.props.settingNumber);
    }

    render() {
        return (<div id="sensors">
            <Ambient sample={this.settings.samples["a"]} />
            <Zero
                settings={{
                    index: this.settingNumber,
                    sample: this.settings.samples[0],
                    delay: this.settings.delay[0],
                    grain: this.settings.grain
                }}
            />
            <One
                settings={{
                    index: this.settingNumber,
                    sample: this.settings.samples[1],
                    delay: this.settings.delay[1],
                    grain: this.settings.grain
                }}
            />
            <Two
                settings={{
                    index: this.settingNumber,
                    sample: this.settings.samples[2],
                    delay: this.settings.delay[2],
                    grain: this.settings.grain
                }}
                volumeScaling={[0,0.8]}
            />
            <Three
                settings={{
                    index: this.settingNumber,
                    sample:this.settings.samples[3],
                    delay: this.settings.delay[3],
                    grain: this.settings.grain
                }}
            />
        </div>);
    }
};

export default Sensors;
