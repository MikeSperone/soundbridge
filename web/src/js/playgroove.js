/**
 * Created by Mike on 8/25/16.
 */
'use strict';
class Playgroove {

    constructor(audio, context) {

        this.audio = audio;
        this.context = context;
        this.src = this.context.createBufferSource();
        this.delay = this.context.createDelay(1.0);
        this.feedback = this.context.createGain();
        this.volume = this.context.createGain();

        this.merge = this.context.createChannelMerger(2);
        this.panL = this.context.createStereoPanner();
        this.panL.pan.value = -1;

        this.merge.connect(this.volume);

        let that = this;

        let req = new XMLHttpRequest();
        req.open('GET', this.audio);
        req.responseType = 'arraybuffer';

        req.onload = function() {
            this.audioData = req.response;

            context.decodeAudioData(this.audioData, function(buffer) {

                    that.src.buffer = buffer;
                    that.src.playbackRate.value = 1;

                    that.volume.connect(context.destination);
                    that.volume.gain.value = 0;
                    that.src.loop = true;

                },
                function(e){console.log("Error with decoding audio data " + e.err);});
        };

        req.send();
        this.src.start(0);
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

    delTime(time) {
        this.delay.delayTime.value = time;
    }

    delFeedback(fbk) {
        this.feedback.gain.value = fbk;
    }

    pbRate(rate) {
        this.src.playbackRate.value = rate;
    }

    vol(v) {
        this.volume.gain.value = v;
    }

}