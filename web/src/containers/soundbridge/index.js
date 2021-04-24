import { h, Component } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import SelectSetting from './SelectSetting';
import Sensors from 'components/Sensors';

import styles from 'styles/bridge.scss';

class Soundbridge extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.solo = props.solo;
        this.isPerformer = props.isPerformer;

        this.state = {
            settingNumber: props.settingNumber,
        }
        this.changeSettings = this.changeSettings.bind(this);
    }

    shouldComponentUpdate(prevProps, nextProps) {
        return prevProps.settingNumber !== nextProps.settingNumber;
    }

    changeSettings(e) {
        e.preventDefault();
        // 2, 8, 11 13 use bridgesound1.mp3 which is currently unavailable
        const settingsToAvoid = [-1, 2, 8, 11, 13];
        var s = -1;
        while (settingsToAvoid.includes(s)) {
            console.info(s, ' - getting new setting');
            s = Math.floor(Math.random() * 29);
        }
        this.setState(
            () => ({settingNumber: s}),
            () => console.info('settings changed')
        );
    }

    render() {
        return <div class="soundbridge">
            {this.solo &&
                <div class="setting-number col-2">
                    <SelectSetting
                        value={this.state.settingNumber}
                        handleChange={this.changeSettings}
                    />
                </div>
            }

            <Sensors
                className={this.solo && "col-8"}
                isPerformer={this.isPerformer || this.solo}
                settingNumber={this.state.settingNumber}
            />
        </div>;
    }
}

export default Soundbridge;
