import { h, createRef, Fragment } from 'preact';
import { useState } from 'preact/compat';
import Slider from 'components/Controls/Slider';

// export default class SensorControls extends Component {
export default function SensorControls (props) {

    const [open, setOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState(1.0);

    const handleToggle = () => setOpen(!open);
    const handleSliderChange = e => {
        setSliderValue(e.target.value);
        props.handleVolume(e.target.value);
    };

    return (
        <div className="sensor-controls">
            <div onClick={handleToggle} className="sensor-menu">&#8942;</div>
            {
                open ? (
                    <Fragment>
                        <Slider
                            mode="absolute"
                            min={0}
                            max={1.0}
                            value={sliderValue}
                            onChange={handleSliderChange}
                        />
                        <button
                            className={props.muted ? "muted" : "mute"}
                            onClick={props.handleMute}
                        >M</button>
                    </Fragment>
                ) : null
            }
        </div>
    );

}

