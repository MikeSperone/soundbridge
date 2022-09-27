import { h, createContext } from 'preact';
import { useState } from 'preact/hooks';
import settingData from './settingData.ts';
const Settings = createContext({settings: null, settingsNumber: null});

const SettingsProvider = ({children}) => {

    const [ settingNumber, setSettingNumber ] = useState(0);
    const [ settings, setSettings ] = useState(settingData[settingNumber]);

    const changeSettings = (n) => {
        console.info('changing settings');
        setSettingNumber(n);
        const s = settingData[settingNumber];
        setSettings(s); //TODO: change for real
    };

    return <Settings.Provider value={{ settings, changeSettings, settingNumber }}>
        {children}
    </Settings.Provider>;
};

export default Settings;
export { SettingsProvider };
