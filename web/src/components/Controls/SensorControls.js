import { h, createRef, Component, Fragment } from 'preact';
import Slider from 'components/Controls/Slider';

export default class SensorControls extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.handleToggle = this.handleToggle.bind(this);
        this.state = {
            open: false,
        };
    }

    handleToggle() {
        this.setState((s) => {
            return { open: !s.open }
        });
    }

    render() {
        return (
            <div className="sensor-controls">
                <div onClick={this.handleToggle} className="sensor-menu">&#8942;</div>
                {
                    this.state.open ? (
                        <Fragment>
                            <Slider
                                mode="absolute"
                                min={0}
                                max={1.0}
                                value={1.0}
                                onChange={this.props.handleVolume}
                            />
                            <button
                                className={this.props.muted ? "muted" : "mute"}
                                onClick={this.props.handleMute}
                            >M</button>
                        </Fragment>
                    ) : null
                }
            </div>
        );

    }
}

