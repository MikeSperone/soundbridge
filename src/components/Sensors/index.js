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
            <Zero  settings={this.props.settings['zero']} />
            <One   settings={this.props.settings['one']} />
            <Two   settings={this.props.settings['two']} volumeScaling={[0,0.8]} />
            <Three settings={this.props.settings['three']} />
        </div>);
    }
};

export default Sensors;
