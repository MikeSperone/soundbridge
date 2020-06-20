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
        this.sensorPos = 0;
        this.startSample = this.play.startSample;
        this.loadAudio = this.play.loadAudio;
        this.stop = this.play.stop;
        this._bind.call(this);
    }

    _bind() {
        this.loop = this.loop.bind(this);
        this.sensor = this.sensor.bind(this);
    }

    sensor(val: number, time: number = 0) {
        console.info('loop sensor time', time);
        //val 0 - 1

        console.info('val', val);
        if (val >= .3) {

            let x = Math.floor(val);

            if (x !== this.sensorPos) {
                this.sensorPos = x;
                this.loop(x);
            }

        } else if (val < 0.1) {
            console.log('just play, loop the whole sample');
            // play
            this.position = 0;
            this.loopEnd = this.duration;
            this.startSample(time);
        }
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
