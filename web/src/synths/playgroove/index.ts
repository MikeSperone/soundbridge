import clip from '../utils/clip';
/**
 * Created by Mike on 8/25/16.
 */
"use strict";

export default class Playgroove {
    context: AudioContext;
    src: AudioBufferSourceNode;
    delay: DelayNode;
    feedback: GainNode;
    volume: GainNode;
    maximumVolume: number;
    merge: ChannelMergerNode;
    panL: StereoPannerNode;

    constructor(context: AudioContext) {

        this.src = context.createBufferSource();
        this.delay = context.createDelay(1.0);
        this.feedback = context.createGain();
        this.volume = context.createGain();
        this.maximumVolume = 1.0;

        this.merge = context.createChannelMerger(2);
        this.panL = context.createStereoPanner();
        this.panL.pan.value = -1;

        this.merge.connect(this.volume);
        this.context = context;

        this._bind.call(this);
    }

    _bind() {
        this.loadAudio = this.loadAudio.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.delaySwitch = this.delaySwitch.bind(this);
        this.delTime = this.delTime.bind(this);
        this.delFeedback = this.delFeedback.bind(this);
        this.pbRate = this.pbRate.bind(this);
    }

    loadAudio(audio) {
        return new Promise(resolve => {
            let that = this;

            let req = new XMLHttpRequest();
            req.open('GET', audio);
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
                    (e: any) => console.info("Error decoding audio data " + e.err, {
                        audioFile: audio,
                        audioData
                    })
                );
            };

            req.onerror = function() {
                console.info('Error loading audio data.', {
                    audioFile: audio,
                    audioData: null
                });
            }
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

    delTime(time: number) {
        // range of .125 - .825(s)
        time = (clip(time) * 0.7) + 0.125;
        this.delay.delayTime.value = time;
    }

    delFeedback(fbk: number) {
        // range of .075 - .495
        fbk = (clip(fbk) * 0.42) + 0.075;
        this.feedback.gain.value = fbk;
    }

    pbRate(rate: number) {
        // should get a range of 0.225 to 1.485
        rate = (clip(rate) * 1.26) + 0.225;
        this.src.playbackRate.value = rate;
    }

    get vol() {
        return this.volume.gain.value;
    }

    set vol(v: number) {
        this.changeVolume(v);
    }

    changeVolume(v: number, t: number = 0.001) {
        const volume = this.maximumVolume * clip(v);
        this.volume.gain
            .cancelScheduledValues(this.context.currentTime);
        this.volume.gain
            .linearRampToValueAtTime(volume, this.context.currentTime + t);

    }

    set volumeScalar(v) {
        this.maximumVolume = clip(v);
        this.changeVolume(v); //TODO: this sets max volume, maybe you weren't there.  Should save "v" from 'changeVolume' (or 'set vol')
    }
}
