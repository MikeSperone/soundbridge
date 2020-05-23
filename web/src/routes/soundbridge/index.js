import { h } from 'preact';
import Sensor from '../../components/Sensor';
import XYPad from '../../components/XYPad';

const Soundbridge = () => (
    <div class="soundbridge">
        <h1>Soundbridge Preact!</h1>

        <Sensor name="zero" />
        <Sensor name="one" />
        <Sensor name="two" />
        <Sensor name="three" />

        <XYPad />
    </div>
);

export default Soundbridge;
