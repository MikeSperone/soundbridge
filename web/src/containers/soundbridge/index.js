import { h, Component } from 'preact';
import { useContext, useState } from 'preact/hooks';
import SelectSetting from './SelectSetting';
import Sensors from 'components/Sensors';
import Solo from 'context/Solo';

import styles from 'styles/bridge.scss';

const Soundbridge = props => {

    const solo = useContext(Solo);

    const [settingNumber, setSettingNumber] = useState(props.settingNumber);

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
        <div class="setting-number col-2">
            <SelectSetting
                value={settingNumber}
                handleChange={changeSettings}
            />
        </div>

        <Sensors
            className={solo.solo && "col-8"}
            settingNumber={settingNumber}
        />
    </div>;
}

export default Soundbridge;
