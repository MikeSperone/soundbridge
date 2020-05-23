import { h, Component } from 'preact';
import Sensor from './Sensor';

export default class One extends Component {

    constructor() {
        super();
    }

    render() {
        return <Sensor name="one" />
    }
}
