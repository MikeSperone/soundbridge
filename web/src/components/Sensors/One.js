import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgroove from 'synths/playgroove';

export default function One(props) {

    const name="one";
    var synth = {};
    var synthLoaded = false;

    const handleLoadAudio = s => {
        synth = s;
        synth.delaySwitch(props.settings.delay);
        synthLoaded = true;
    }

    // if (synth.isMuted()) return;
    const handleEnter = () => {
        synthLoaded &&
            (synth.isMuted() || synth.changeVolume(0.7, 1.5));
    }

    const handleExit = () => synth.changeVolume(0, 5.0);

    const handleMove = (value) => {
        if (synthLoaded) {
            synth.pbRate(value);
            synth.delTime(value);
            synth.delFeedback(value);
        }
    }

    return (
        <Sensor
            name={name}
            synth={Playgroove}
            active={props.active}
            settings={props.settings}
            onEnter={handleEnter}
            onMove={handleMove}
            onExit={handleExit}
            onLoadAudio={handleLoadAudio}
        />
    );
}
