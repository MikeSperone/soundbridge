import { h, Component } from 'preact';
import SelectSetting from 'components/Controls/SelectSetting';
import Sensors from 'components/Sensors';

import getSettings from './settings';
import styles from 'styles/bridge.scss';

class Soundbridge extends Component {

    constructor(props) {
        super(props);
        this.ws = props.socket;

        this.settings = getSettings(this.props.settingNumber);
    }

    render() {
        return (
            <div class="soundbridge">

                {this.props.solo &&
                    <SelectSetting
                        value={this.props.settingNumber}
                        handleChange={this.changeSettings}
                    />
                }

                {this.settings && (
                    <Sensors
                        isPerformer={this.props.isPerformer}
                        settingNumber={this.props.settingNumber}
                        settings={this.settings}
                    />
                )}

            </div>
        );
    }
}

export default Soundbridge;
