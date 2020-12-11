import { h, Component } from 'preact';
import Ambient from './Ambient';
import Zero from './Zero';
import One from './One';
import Two from './Two';
import Three from './Three';

import getSettings from 'containers/soundbridge/settings';

const Sensors = props => {

    const settings = getSettings(props.settingNumber);

    return (<div id="sensors">
        <Ambient sample={settings.samples["a"]} />
        <Zero
            settings={{
                index: props.settingNumber,
                sample: settings.samples[0],
                delay: settings.delay[0],
                grain: settings.grain
            }}
        />
        <One
            settings={{
                index: props.settingNumber,
                sample: settings.samples[1],
                delay: settings.delay[1],
                grain: settings.grain
            }}
        />
        <Two
            settings={{
                index: props.settingNumber,
                sample: settings.samples[2],
                delay: settings.delay[2],
                grain: settings.grain
            }}
        />
        <Three
            settings={{
                index: props.settingNumber,
                sample: settings.samples[3],
                delay: settings.delay[3],
                grain: settings.grain
            }}
        />
    </div>);
};

export default Sensors;
