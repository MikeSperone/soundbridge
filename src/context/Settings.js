import { h, createContext } from 'preact';
import { useState } from 'preact/hooks';
import settingData from './settingData.ts';
// const Settings = createContext({settings: null, settingsNumber: null});
const Settings = createContext(null);

export default function SettingsProvider(props) {

    const [ settingNumber, setSettingNumber ] = useState(0);
    const [ settings, setSettings ] = useState(settingData[settingNumber]);

    const changeSettings =  () => {
        console.info('changing settings');
        setSettings(3); //TODO: change for real
    }

    return <Settings.Provider value={{ settings, setSettings, settingNumber, setSettingNumber }}>
        {props.children}
    </Settings.Provider>;
};

export const withSettingsContext = Component => (
  props => (
    <Settings.Consumer>
      {({settings, settingNumber }) => <Component settings={settings} settingNumber={settingNumber}  {...props} />}
    </Settings.Consumer>
  )
);
