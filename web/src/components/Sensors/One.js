import { h, Component } from 'preact';
import Sensor from './Sensor';
import Playgroove from 'synths/playgroove';

export default function One(props) {

    const name="one";
    const settings = props.settings;
    var synth;

    const handleLoadAudio = s => {
        synth = s;
        synth.delaySwitch(settings.delay);
    }

    // if (this.synth.isMuted()) return;
    const handleEnter = () => synth.changeVolume(0.7, 1.5);

    const handleExit = () => synth.changeVolume(0, 5.0);

    const handleMove = (value) => {
        synth.pbRate(value);
        synth.delTime(value);
        synth.delFeedback(value);
    }

    return settings.sample && (
        <Sensor
            name={name}
            synth={Playgroove}
            settings={settings}
            onEnter={handleEnter}
            onMove={handleMove}
            onExit={handleExit}
            onLoadAudio={handleLoadAudio}
        />
    );
}
