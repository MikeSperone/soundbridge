import { h, Component } from 'preact';

export default class Button extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        this.className = this.setClassName.call(this);
    }

    setClassName() {
        const active = this.props.active ? 'active' : '';
        const type = this.props.type || '';
        return active + type;
    }

    render() {
        return (
            <button
                className={this.className}
                active={this.props.active}
                name={this.props.name}
                value={this.props.value}
                onClick={this.props.onClick}
            >{this.props.name}
            </button>
        );
    }
}
