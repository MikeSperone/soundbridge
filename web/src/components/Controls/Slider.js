import { h, Component } from 'preact';

export default class Slider extends Component {

    constructor(props) {
        super(props);
        this.min = this.props.min || 0;
        this.max = this.props.max || 1;
        this.step = this.props.step || 0.01;
        [this.width, this.height] = this.props.size;
    }

    render() {
        return (
            <div
                className="range-slider"
                style={`height: ${this.height}px; width: ${this.width}px`}
            >
                <input
                    className="input-range"
                    orient="vertical"
                    type="range"
                    step="0.01"
                    value={this.props.value}
                    min={this.min}
                    max={this.max}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}
