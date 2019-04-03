/**
 * Created by Mike on 8/25/16.
 */
"use strict";

export default class Playgroove {

    constructor(audio, context) {

        this.audio = audio;
        console.log('this.audio: ', this.audio);
        this.context = context;
        this.src = this.context.createBufferSource();
        this.delay = this.context.createDelay(1.0);
        this.feedback = this.context.createGain();
        this.volume = this.context.createGain();

        this.merge = this.context.createChannelMerger(2);
        this.panL = this.context.createStereoPanner();
        this.panL.pan.value = -1;

        this.merge.connect(this.volume);

    }
    loadAudio() {
        return new Promise(resolve => {
            let that = this;

            let req = new XMLHttpRequest();
            console.log('loadAudio');
            console.log('this.audio: ', this.audio);
            req.open('GET', this.audio);
            req.responseType = 'arraybuffer';

            req.onload = function() {
                const audioData = req.response;

                that.context.decodeAudioData(audioData, buffer => {

                        this.src.buffer = buffer;
                        that.src.playbackRate.value = 1;

                        that.volume.connect(that.context.destination);
                        that.volume.gain.value = 0;
                        that.src.loop = true;

                        that.src.start(0);
                        resolve("Audio loaded");
                    },
                    function(e){console.log("Error decoding audio data " + e.err);});
            };

            req.send();
        });
    }

    delaySwitch(setting) {
        if (setting) {
            console.debug("delay on");
            this.delay.connect(this.feedback);
            this.feedback.connect(this.delay);
            if (this.panL.empty !== true) {
                console.debug("connection panL");
                this.delay.connect(this.merge, 0, 1);
                this.src.connect(this.panL);
                this.src.connect(this.delay);
                this.panL.connect(this.volume);
            } else {
                console.debug("panL left out");
                this.delay.connect(this.merge, 0, 1);
                this.src.connect(this.merge, 0, 0);
                this.merge.connect(this.volume);
            }
        } else {
            this.src.connect(this.volume);
        }
    }

    _restrict(val) {
        if (val < 0) val = 0;
        if (val > 1) val = 1;
        return val;
    }

    delTime(time) {
        this.delay.delayTime.value = this._restrict(time);
    }

    delFeedback(fbk) {
        this.feedback.gain.value = this._restrict(fbk);
    }

    pbRate(rate) {
        this.src.playbackRate.value = this._restrict(rate);
    }

    vol(v) {
        this.volume.gain.value = this._restrict(v);
    }

}
