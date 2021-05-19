import { h, Component } from 'preact';
import Solo from 'context/Solo';
import Zero from './Zero';
import One from './One';
import Two from './Two';
import Three from './Three';


class Sensors extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    shouldComponentUpdate(nextProps) {
        const shouldUpdate = (this.props.settingNumber !== nextProps.settingNumber) ||
            (typeof nextProps.forceUpdate !== "undefined" && nextProps.forceUpdate);
        console.info('should update... ', shouldUpdate);
        return shouldUpdate;
    }

    render() {
        return (<div id="sensors">
            <Zero
                settings={{
                    index: this.props.settingNumber,
                    sample: this.props.settings.samples[0],
                    delay: this.props.settings.delay[0],
                    grain: this.props.settings.grain
                }}
            />
            <One
                settings={{
                    index: this.props.settingNumber,
                    sample: this.props.settings.samples[1],
                    delay: this.props.settings.delay[1],
                    grain: this.props.settings.grain
                }}
            />
            <Two
                settings={{
                    index: this.props.settingNumber,
                    sample: this.props.settings.samples[2],
                    delay: this.props.settings.delay[2],
                    grain: this.props.settings.grain
                }}
                volumeScaling={[0,0.8]}
            />
            <Three
                settings={{
                    index: this.props.settingNumber,
                    sample:this.props.settings.samples[3],
                    delay: this.props.settings.delay[3],
                    grain: this.props.settings.grain
                }}
            />
        </div>);
    }
};

export default Sensors;
