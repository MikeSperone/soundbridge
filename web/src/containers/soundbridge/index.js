import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import SelectSetting from './SelectSetting';
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
                <div class="setting-number col-2">
                    <SelectSetting
                        value={settingNumber}
                        handleChange={changeSettings}
                    />
                </div>
            }

            {settingNumber && (
                <Sensors
                    className={props.solo && "col-8"}
                    isPerformer={props.isPerformer || props.solo}
                    settingNumber={settingNumber}
                />
            )}

        </div>
    );
}

export default Soundbridge;
