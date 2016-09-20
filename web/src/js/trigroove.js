/**
 * Created by Mike on 9/2/16.
 */

class Loop extends Play {

    constructor(audio, context) {
        super(audio, context);
        this.audio = audio;
        this.context = context;
        this.position = 0;
        this.sensorPos = null;
        this.play();
    }

    sensor(val) {
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
            this.startSample(0);

        }
    }

    loop(x) {
        let start;
        let dur = this.duration;
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
                start = 0.9*dur;
                break;
        }
        console.log("start: " + start);
        this.position = start;
        this.length = 1.2;
        this.startSample(this.position);
    }


    hold(x) {

    }

    delaySwitch(setting) {
        if (setting) {
            //console.log("delay on");
            this.delay.connect(this.feedback);
            this.feedback.connect(this.delay);
            this.delay.connect(this.merge, 0, 1);
            this.src.connect(this.panL);
            this.src.connect(this.delay);
            this.panL.connect(this.volume);
        } else {
            //console.log("delay off");
            this.src.connect(this.volume);
        }
    }



}