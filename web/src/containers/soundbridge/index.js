import { h, Component } from 'preact';
import { useState } from 'preact/hooks';
import SelectSetting from './SelectSetting';
import Sensors from 'components/Sensors';

import styles from 'styles/bridge.scss';

const Soundbridge = props => {

    const [ settingNumber, setSettingNumber ] = useState(props.settingNumber);

    function changeSettings(e) {
        e.preventDefault();
        // 2, 8, 11 13 use bridgesound1.mp3 which is currently unavailable
        const settingsToAvoid = [-1, 2, 8, 11, 13];
        var s = -1;
        while (settingsToAvoid.includes(s)) {
            console.info(s, ' - getting new setting');
            s = Math.floor(Math.random() * 29);
        }
        setSettingNumber(s);
    }

    return <div class="soundbridge">
        {props.solo &&
            <div class="setting-number col-2">
                <SelectSetting
                    value={settingNumber}
                    handleChange={changeSettings}
                />
            </div>
        }

        <Sensors
            className={props.solo && "col-8"}
            isPerformer={props.isPerformer || props.solo}
            settingNumber={settingNumber}
        />

    </div>;
}

export default Soundbridge;
