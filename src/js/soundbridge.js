"use strict";
import $ from 'jquery';
import Ambient      from './synths/ambient.js';
import Play         from './synths/play.js';
import Playgroove   from './synths/playgroove.js';
import Playgrain    from './synths/playgrain.js';
import Loop         from './synths/loop.js';

export function setSettings(settings, i) {

	console.log("setting number: ", (i + 1));

	const samples = settings.samples[i],
		  grainSettings = settings.grain[i],
		  delaySettings = settings.delay[i];

	return { samples: samples, grain: grainSettings, delay: delaySettings };
}

export function start(settings, ws, openConnection) {

    const audiopath = 'audio/';
    /*
    * Audio setup
    */

    // Sensors
    let sensor = $('.sensor');
    let xy = $('.xy-pad');
    let rate = 1;
    let zeroOut, oneOut, twoOut, threeOut;

    // load settings
    console.log('1. loading settings');
    let samples = settings.samples;
    let grainSettings = settings.grain;
    let delaySettings = settings.delay;

    // set samples
    console.log('2. setting samples');
    let audioZero = audiopath + samples[0] + '.mp3';
    let audioOne  = audiopath + samples[1] + '.mp3';
    let audioTwo  = audiopath + samples[2] + '.mp3';
    let audioThree = audiopath + samples[3] + '.mp3';
    let audioThreeHold = audiopath + 'hold/' + samples[3] + '_slow.mp3';

    let time = 0;

    let delayOn = true;
    let context = new window.AudioContext();

    if (samples.a !== "") {
        console.log('3. starting ambient');
        let audioAmb = audiopath + samples.a + '.mp3';
        //let ambient = new Play(audioAmb, context, 0.8);
    }

    let zero = new Playgroove(audioZero, context);
    zero.loadAudio().then(() => zero.delaySwitch(delaySettings[0]));

    let one = new Playgroove(audioOne, context);
    one.loadAudio().then(() => one.delaySwitch(delaySettings[1]));

    // let two = new Playgrain(audioTwo, context);
    // two.loadAudio().then(() => {
    //     two.scatter = grainSettings[0];
    //     two.fade = grainSettings[1];
    //     two.spread = grainSettings[2];
    //     two.feedback = grainSettings[3];
    // });

    // let three = new Loop(audioThree, context);
    // let threeHold = new Play(audioThreeHold, context);
    // threeHold.loadAudio().then(() => {});
    //three.delay(delaySettings[4]);

    let threePosition = 0;

	ws.on('out', function(d){
		out(d);
	});

	ws.on('over', function(d){
		over(d);
	});

	ws.on('data', function(d){
		moveHand(d[1], d[0], 'remote');
	});

    function transmit(dest, msg) {
        if (openConnection) {
			console.log("transmitting message to "+dest);
            ws.emit(dest, msg);
        }
    }

    let over = id => {
        switch (id) {
            case 'zero':
                zero.volume.gain.cancelScheduledValues(context.currentTime);
                zero.volume.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.5);
                break;
            case 'one':
                one.volume.gain.cancelScheduledValues(context.currentTime);
                one.volume.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.5);
                clearTimeout(oneOut);
                break;
            case 'two':
                clearTimeout(twoOut);
                two.start();
                break;
            case 'three':
                //clearTimeout(threeOut);
                break;
            default:
                break;
        }

    };

    let out = id => {

        switch (id) {
            case 'zero':
                zero.volume.gain.cancelScheduledValues(context.currentTime);
                zero.volume.gain.linearRampToValueAtTime(0, context.currentTime + 5.0);
                break;
            case 'one':
                oneOut = setTimeout(function(){ one.vol(0); }, 5000);
                break;
            case 'two':
                twoOut = setTimeout(function(){ two.stop(); }, 5000);
                break;
            case 'three':
                setTimeout(function(){ three.stop(); threeHold.stop();}, 5000);
                threePosition = 0;
                break;
            default:
                break;
        }

    };

    sensor.on(
        {
            mouseenter: function () {
                over(this.id);
                transmit("over", this.id);
            },
            mouseleave: function () {
                out(this.id);
                transmit("out", this.id);
            },
            mousemove: function(event) {
                //console.log(event.offsetX);
                //event.pageX range: 60 - 400
                moveHand(event.offsetX + 1, this.id, 'local');
                transmit("data", [this.id, event.offsetX + 1]);

            }
        }
    );

    function moveHand(event, id, src) {

        //event = (src === 'local') ? event.offsetX : event;
        let rate = (event/270);                   // range of .225 - 1.48
        $('#'+id).children('.value').text(rate.toFixed(2));

        switch (id) {
            case 'zero':
                zero.pbRate(rate);
                if (delayOn) {
                    zero.delTime(event/485);      // range of .125 - .825(s)
                    zero.delFeedback(event/808);  // range of .075 - .495
                }
                break;
            case 'one':
                one.pbRate(rate);
                if (delayOn) {
                    one.delTime(event/485);
                    one.delFeedback(event/808);
                }
                break;
            case 'two':
                // range: 0 - 1
                two.read = event/360;
                break;
            case 'three':

                if (event > 231) {
                    console.log('entered 3.  From ' + threePosition);
                    if (threePosition === 2) { threeHold.stop(); }
                    threePosition = 3;
                    three.sensor(event / 11);

                } else if (event < 121) {
                    console.log('entered 1.  From ' + threePosition);
                    if (threePosition !== 1) {

                        time = (threePosition === 2) ? (threeHold.elapsedTime/4) : time;
                        threeHold.stop();
                        threePosition = 1;
                        three.sensor(event / 11, time);

                    }

                } else {
                    console.log('entered 2.  From ' + threePosition);
                    if (threePosition !== 2) {
                        time = (threePosition === 1) ? (three.elapsedTime * 4) : time;
                        if (threePosition !== 0) { three.stop(); }
                        threePosition = 2;
                        threeHold.vol = 1;
                        threeHold.startSample(time);
                    }

                }

                break;
            default:
                break;
        }
    }
}

