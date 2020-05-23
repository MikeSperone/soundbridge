import { h, Component } from 'preact';
import Sensor from './Sensor';

export default class Zero extends Component {

    constructor() {
        super();
    }

    render() {
        return <Sensor name="zero" />
    }
}
