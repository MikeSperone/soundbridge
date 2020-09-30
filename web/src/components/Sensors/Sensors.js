import { h, Component } from 'preact';
import { Zero, One, Two, Three } from 'components/Sensors';

const Sensors = props => (
    <div id="sensors">
        <Zero
            active={props.isPerformer}
            settings={{
                index: props.settingNumber,
                sample: props.settings.samples[0],
                delay: props.settings.delay[0],
                grain: props.settings.grain
            }}
        />
        <One
            active={props.isPerformer}
            settings={{
                index: props.settingNumber,
                sample: props.settings.samples[1],
                delay: props.settings.delay[1],
                grain: props.settings.grain
            }}
        />
        <Two
            active={props.isPerformer}
            settings={{
                index: props.settingNumber,
                sample: props.settings.samples[2],
                delay: props.settings.delay[2],
                grain: props.settings.grain
            }}
        />
        <Three
            active={props.isPerformer}
            settings={{
                index: props.settingNumber,
                sample: props.settings.samples[3],
                delay: props.settings.delay[3],
                grain: props.settings.grain
            }}
        />
    </div>
);

export default Sensors;
