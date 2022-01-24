import { h, Component } from 'preact';

export default class Debug extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        console.log('debug mounted');
    }

    render() {
        return (
            <div className="message-box debug">
                <h3>Debug</h3>
                <div className="messages"></div>
            </div>
        )
    }
}

