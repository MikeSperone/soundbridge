import { h, Component, Fragment } from 'preact';
import Socket from 'context/Socket';
import XYPad from 'components/XYPad';
import Button from 'components/Controls/Button';
import SelectSetting from 'components/Controls/SelectSetting';
import Sensors from 'components/Sensors';

import getSettings from './settings';
import styles from 'styles/bridge.scss';

const StartButton = props => (
    <button className='start' onClick={props.begin}>
        <h2>{props.ioReady ? 'Start' : 'Not Ready'}</h2>
    </button>
);

class Soundbridge extends Component {

    constructor(props) {
        super(props);
        this.ws = props.socket;

        this.begin = this.begin.bind(this);

        this.state = {
            audio: false,
            messages: {
                debug: '',
            },
            started: true,
        };

        console.info('changing settings to ', props.settingNumber);
        this.settings = getSettings(this.props.settingNumber);
        console.info('settings: ', this.settings);

    }

    begin() {
        this.setState(() => ({started: true}));
    }


    componentDidMount() {
    }

    render() {
        return (
            <div class="soundbridge">
                {!this.state.started && (
                    <StartButton
                        begin={this.begin}
                        ioReady={true}
                    />
                )}

                {this.props.solo &&
                    <SelectSetting
                        value={this.props.settingNumber}
                        handleChange={this.changeSettings}
                    />
                }

                {this.settings && this.state.started && (
                    <Sensors
                        isPerformer={this.props.isPerformer}
                        settingNumber={this.props.settingNumber}
                        settings={this.settings}
                    />
                )}

            </div>
        );
    }
}

export default Soundbridge;
