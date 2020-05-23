import { h, Component } from 'preact';
import Sensor from './Sensor';

export default class Two extends Component {

    constructor() {
        super();
    }

    render() {
        return <Sensor name="two" />
    }
}
