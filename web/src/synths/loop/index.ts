/**
 * Created by Mike on 9/2/16.
 */

import Play from '../play';

export default class Loop {

    audio: string;
    context: AudioContext;
    sensorPos: number;

    constructor(audio: string, context: AudioContext) {
        this.play = new Play(audio, context);
        this.audio = this.play.audio;
        this.context = this.play.context;
        this.sensorPos = 0;
        this.startSample = this.play.startSample;
        this.changeVolume = this.play.changeVolume;
        this.loadAudio = this.play.loadAudio;
        this.stop = this.play.stop;
        this._bind.call(this);
    }

    _bind() {
        this.loop = this.loop.bind(this);
        this.sensor = this.sensor.bind(this);
        this.playAll = this.playAll.bind(this);
    }

    sensor(val: number, time: number = 0) {
        console.info('loop sensor time', time);
        //val 0 - 1

        if (val >= .3) {
            console.info('sensor val', val);

            let x = Math.floor(val * 10) / 10;

            if (x !== this.sensorPos) {
                this.sensorPos = x;
                this.loop(x);
            }

        }
    }

    playAll(time: number = 0) {
        this.position = 0;
        this.loopEnd = this.duration;
        this.startSample(time);
    }

    set duration(d) {
        this.play.duration = d;
    }

    get duration() {
        return this.play.duration;
    }

    set position(p) {
        this.play.position = p;
    }

    get position() {
        return this.play.position;
    }

    set loopEnd(l) {
        this.play.loopEnd = l;
    }

    get loopEnd() {
        return this.play.loopEnd;
    }

    set loopLength(l) {
        this.play.loopLength = l;
    }

    get loopLength() {
        return this.play.loopLength;
    }

    loop(x: number) {
        // .3 - .9

        console.log('this duration: ', this.play.duration);
        this.position = x * this.duration;
        this.stop();
        console.log("start: " + this.position);
        this.loopLength = 1.2;
        this.startSample(this.position);
    }

    get elapsedTime() {
        return this.play.elapsedTime;
    }

    set vol(v: number) {
        this.play.changeVolume(v);
    }

    get vol() {
        return this.play.vol;
    }
    set volumeScalar(v: number) {
        this.play.volumeScalar = v;
        this.play.changeVolume(this.vol);
    }

    //delaySwitch(setting: boolean) {
    //    if (setting) {
    //        //console.log("delay on");
    //        this.delay.connect(this.feedback);
    //        this.feedback.connect(this.delay);
    //        this.delay.connect(this.merge, 0, 1);
    //        this.src.connect(this.panL);
    //        this.src.connect(this.delay);
    //        this.panL.connect(this.volume);
    //    } else {
    //        //console.log("delay off");
    //        this.src.connect(this.volume);
    //    }
    //}

}
