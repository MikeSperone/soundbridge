/**
 * Created by Mike on 9/2/16.
 */

import Play from './play';

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
        this.length = 0;
        this.duration = 0;
        //this.play();
    }

    sensor(val: number, time: number = 0) {

        let x = Math.floor(val);

        if (x > 20) {

            if (x !== this.sensorPos) {
                this.sensorPos = x;
                this.loop(x);
            }

        } else if (x < 11) {
            // play
            this.position = 0;
            this.length = this.duration;
            this.startSample(time);

        }
    }

    loop(x: number) {
        let start: number = 0;
        let dur: number = this.duration;
        this.stop();
        switch(x) {
            case 21:
            case 22:
                start = 0.3*dur;
                break;
            case 23:
            case 24:
                start = 0.4*dur;
                break;
            case 25:
            case 26:
                start = 0.5*dur;
                break;
            case 27:
            case 28:
                start = 0.6*dur;
                break;
            case 29:
            case 30:
                start = 0.7*dur;
                break;
            case 31:
            case 32:
                start = 0.8*dur;
                break;
            default:
                if (x > 32) {
                    start = 0.9*dur;
                } else if (x < 21) {
                    start = 0.3 * dur;
                }
                break;
        }
        console.log("start: " + start);
        this.position = start;
        this.length = 1.2;
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
