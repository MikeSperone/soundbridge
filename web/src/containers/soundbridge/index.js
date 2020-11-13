import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import SelectSetting from 'components/Controls/SelectSetting';
import Sensors from 'components/Sensors';

import styles from 'styles/bridge.scss';

const Soundbridge = props => {

    const [ settingNumber, setSettingNumber ] = useState(props.settingNumber);

    function changeSettings(e) {
        e.preventDefault();
        setSettingNumber(Math.floor(Math.random() * 29));
    }

    return (
        <div class="soundbridge">

            {props.solo &&
                <SelectSetting
                    value={settingNumber}
                    handleChange={changeSettings}
                />
            }

            {settingNumber && (
                <Sensors
                    isPerformer={props.isPerformer || props.solo}
                    settingNumber={settingNumber}
                />
            )}

        </div>
    );
}

export default Soundbridge;
