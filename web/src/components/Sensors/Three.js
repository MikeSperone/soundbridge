import { h, Component } from 'preact';
import Sensor from './Sensor';

export default class Three extends Component {

    constructor() {
        super();
    }

    render() {
        return <Sensor name="three" />
    }
}
