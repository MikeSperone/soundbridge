/**
 * Created by Mike on 9/2/16.
 */

import Play from '../play';

export default class Loop extends Play {

    audio: string;
    context: AudioContext;
    position: number;
    sensorPos: number;
    length: number;
    duration: number;

    constructor(audio: string, context: AudioContext) {
        super(audio, context);
        this.audio = audio;
        this.context = context;
        this.position = 0;
        this.sensorPos = 0;
        // this.length = 0;
        // this.duration = 0;
        //this.play();
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
            this.loopEnd = super.duration;
            this.startSample(time);
            //TODO: I think I messed up with class inheritance
            // and the issue here seems to be the Play attributes vs. this
            // class (Loop)'s attributes.  I think

        }
    }

    loop(x: number) {
        // .3 - .9

        console.log('this duration: ', this.duration);
        console.log('super duration: ', super.duration);
        let start: number = x * super.duration;
        this.stop();
        console.log("start: " + start);
        super.position = start;
        super.loopLength = 1.2;
        super.startSample(super.position);
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
