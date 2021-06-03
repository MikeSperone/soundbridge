import { h, Component } from 'preact';
import { useContext, useState } from 'preact/hooks';
import SelectSetting from './SelectSetting';
import Sensors from 'components/Sensors';
import Solo from 'context/Solo';

import styles from 'styles/bridge.scss';
import settingsData from './settings';

const Soundbridge = props => {

    const solo = useContext(Solo);

    const initialSetting = props.settingNumber;
    const [settingNumber, setSettingNumber] = useState(initialSetting);
    const [settings, setSettings] = useState(settingsData[initialSetting]);

    function changeSettings(e) {
        e.preventDefault();
        // 8 settings, 0-7
        var s = Math.floor(Math.random() * 7);
        console.info('setting number being set to ', s);
        setSettingNumber(s);
        setSettings(settingsData[s]);
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
            settings={settings}
        />
    </div>;
}

export default Soundbridge;
