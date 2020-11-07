import { h, Component } from 'preact';
import Play from 'synths/play';

const audioPath = '/audio';

const Ambient = props => {
    console.info('Ambient Sound loading');
    const audio = `${audioPath}/${props.sample}.mp3`;
    console.info('Ambient sound: ', audio);
    if (!window.globalAudioContext || !props.sample) return;
    const p = new Play(audio, globalAudioContext, 1.0);
    console.info('newPlay', p);
    p.loadAudio().then(() => p.startSample());
    return true;
}

export default Ambient;