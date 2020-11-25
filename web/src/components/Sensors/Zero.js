import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgroove from 'synths/playgroove';

export default function Zero(props) {

    const name="zero";
    var synth = {};
    var synthLoaded = false;

    const handleLoadAudio = s => {
        synth = s;
        synth.delaySwitch(props.settings.delay);
        synthLoaded = true;
    }

    const handleEnter = () => {
        synthLoaded &&
            (synth.isMuted() || synth.changeVolume(0.7, 1.5));
    }

    const handleExit = () => synth.changeVolume(0, 5.0);

    const handleMove = value => {
        if (synthLoaded) {
            // Value is 0.0 - 1.0
            synth.pbRate(value);
            synth.delTime(value);      // range of .125 - .825(s)
            synth.delFeedback(value);  // range of .075 - .495
        }
    }

    return <Sensor
        name={name}
        synth={Playgroove}
        active={props.active}
        settings={props.settings}
        onEnter={handleEnter}
        onMove={handleMove}
        onExit={handleExit}
        onLoadAudio={handleLoadAudio}
    />;
}
