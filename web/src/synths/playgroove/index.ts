/**
 * Created by Mike on 8/25/16.
 */
"use strict";

export default class Playgroove {
    audio: string;
    context: AudioContext;
    src: AudioBufferSourceNode;
    delay: DelayNode;
    feedback: GainNode;
    volume: GainNode;
    merge: ChannelMergerNode;
    panL: StereoPannerNode;

    public constructor(audio: string, context: AudioContext) {

        this.src = context.createBufferSource();
        this.delay = context.createDelay(1.0);
        this.feedback = context.createGain();
        this.volume = context.createGain();
        this.maximumVolume = 1.0;

        this.merge = context.createChannelMerger(2);
        this.panL = context.createStereoPanner();
        this.panL.pan.value = -1;

        this.merge.connect(this.volume);
        this.audio = audio;
        this.context = context;

        this.changeVolume = this.changeVolume.bind(this);
    }

    public loadAudio() {
        return new Promise(resolve => {
            let that = this;

            let req = new XMLHttpRequest();
            req.open('GET', that.audio);
            req.responseType = 'arraybuffer';

            req.onload = function() {
                const audioData = req.response;

                that.context.decodeAudioData(audioData, buffer => {

                        that.src.buffer = buffer;
                        that.src.playbackRate.value = 1;

                        that.volume.connect(that.context.destination);
                        that.volume.gain.value = 0;
                        that.src.loop = true;

                        that.src.start(0);
                        resolve("Audio loaded");
                    },
                    (e: any) => console.log("Error decoding audio data " + e.err)
                );
            };

            req.send();
        });
    }

    delaySwitch(setting: boolean) {
        if (setting) {
            console.debug("delay on");
            this.delay.connect(this.feedback);
            this.feedback.connect(this.delay);
            this.delay.connect(this.merge, 0, 1);
            // "empty" property does exist on Safari, so I check for it
            // @ts-ignore: Suppress 'Property does not exist' error
            if (this.panL.empty !== true) {
                console.debug("connection panL");
                this.src.connect(this.panL);
                this.src.connect(this.delay);
                this.panL.connect(this.volume);
            } else {
                console.debug("panL left out");
                this.src.connect(this.merge, 0, 0);
                this.merge.connect(this.volume);
            }
        } else {
            this.src.connect(this.volume);
        }
    }

    _restrict(val: number) {
        if (val < 0) val = 0;
        if (val > 1) val = 1;
        return val;
    }

    delTime(time: number) {
        this.delay.delayTime.value = this._restrict(time);
    }

    delFeedback(fbk: number) {
        this.feedback.gain.value = this._restrict(fbk);
    }

    pbRate(rate: number) {
        this.src.playbackRate.value = this._restrict(rate);
    }

    get vol() {
        return this.volume.gain.value;
    }

    set vol(v: number) {
        this.changeVolume(v);
    }

    changeVolume(v: number, t: number = 0) {
        const volume = this.maximumVolume * this._restrict(v);
        this.volume.gain
            .cancelScheduledValues(this.context.currentTime);
        this.volume.gain
            .linearRampToValueAtTime(volume, this.context.currentTime + t);

    }

    set volumeScalar(v) {
        this.maximumVolume = this._restrict(v);
        this.changeVolume(v, 0.01);
    }
}
