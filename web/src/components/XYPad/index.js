import { h } from 'preact';
import Sensor from '../../components/Sensor';

const XYPad = props => {
    return <div class="xy-pad">
        <Sensor type="qd" name="zero" />
        <Sensor type="qd" name="one" />
        <Sensor type="qd" name="two" />
        <Sensor type="qd" name="three" />
    </div>;
}

export default XYPad;
