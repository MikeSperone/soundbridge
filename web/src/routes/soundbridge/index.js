import { h } from 'preact';
import { Zero, One, Two, Three } from '../../components/Sensors';
import XYPad from '../../components/XYPad';
import styles from '../../style/bridge.scss';

const Soundbridge = () => (
    <div class="soundbridge">
        <h1>Soundbridge Preact!</h1>

        <Zero />
        <One />
        <Two />
        <Three />

        <XYPad />
    </div>
);

export default Soundbridge;
