import { h, Component } from 'preact';
import Sensor from './Sensor';
import Loop from 'synths/loop';
import Play from 'synths/play';
import audioPath from './audioPath';

const log = m => console.log('[Three] ', m);

export default function Three(props) {

    const name = "three";
    const settings = props.settings;

    var synth,
        holdSynth,
        holdSynthReady = false,
        time = 0,
        position = 0,
        timeout = null;

    const handleLoadAudio = (s) => {
        log('audio loaded');
        synth = s;
        synth.scatter = settings.grain[0];
        synth.fade = settings.grain[1];
        synth.spread = settings.grain[2];
        synth.feedback = settings.grain[3];

        holdSynth = new Play(`${audioPath}/hold/${settings.sample}_slow.mp3`, window.globalAudioContext);
        holdSynth.loadAudio().then(() => holdSynthReady = true);
    }

    const handleEnter = () => clearTimeout(timeout);

    const handleExit = () => {
        timeout = setTimeout(() => {
            synth.stop();
            holdSynth.stop();
            position = 0;
        }, 5000);
    }

    const stopHold = () => (position === 2) && holdSynth.stop();

    const firstPosition = () => {
        // Position 1
        if (position !== 1) {
            log('entered 1.  From ' + position);

            time = (position === 2) ?
                holdSynth.elapsedTime / 4 :
                time;
            stopHold();

            position = 1;
            synth.changeVolume(1);
            synth.playAll(time);
        }
    }

    const secondPosition = () => {
        // Position 2
        if (position !== 2) {
            log('You have entered 2.  From ' + position);
            time = (position === 1) ?
                synth.elapsedTime * 4 :
                time;
            // TODO: I guess I need this line, but it's breaking
            if (position !== 0) synth.stop();
            holdSynth.changeVolume(1);
            holdSynth.startSample(time);
            position = 2;
        }
    }

    const thirdPosition = (value) => {
        if (position !== 3) log('entered 3.  From ' + position);
        stopHold();
        position = 3;
        // const scaledValue = (0.6 * value) - 0.9;
        const scaledValue = (2 * value) - 1.035;
        synth.changeVolume(1);
        synth.sensor(scaledValue);
    }

    const handleMove = (value) => {
        if (value > 0.666666666) {
            thirdPosition(value);
        } else if (value > 0.333333333) {
            secondPosition();
        } else {
            firstPosition();
        }
    }

    return <Sensor
        name={name}
        synth={Loop}
        active={props.active}
        settings={settings}
        onEnter={handleEnter}
        onMove={handleMove}
        onExit={handleExit}
        onLoadAudio={handleLoadAudio}
    />;
}
