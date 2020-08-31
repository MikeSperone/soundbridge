import { h, Component } from 'preact';

export default function Slider(props) {

    const min = props.min || 0;
    const max = props.max || 1;
    const step = props.step || 0.01;
    const [width, height] = props.size;

    return (
        <div
            className="range-slider"
            style={`height: ${height}px; width: ${width}px`}
        >
            <input
                className="input-range"
                orient="vertical"
                type="range"
                step="0.01"
                value={props.value}
                min={min}
                max={max}
                onChange={props.onChange}
            />
        </div>
    );
}
