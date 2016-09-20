"use strict";
//Global test variable
let test;
$.getJSON("js/settings.json",
    function(json){
        console.log("settings loaded");
        run(json);
    });

function run(settings) {

    /*
    * Audio setup
    */

    // Sensors
    let sensor = $('.sensor');
    let rate = 1;
    let zeroOut, oneOut, twoOut, threeOut;

    // load settings
    let i = Math.floor(Math.random() * 29);
    let samples = settings.samples[i];
    let grainSettings = settings.grain[i];
    let delaySettings = settings.delay[i];

    console.log("setting number: " + i);

    // set samples
    let audioZero = 'audio/' + samples[0] + '.mp3';
    let audioOne = 'audio/' + samples[1] + '.mp3';
    let audioTwo = 'audio/' + samples[2] + '.mp3';
    let audioThree = 'audio/' + samples[3] + '.mp3';
    let audioThreeHold = 'audio/hold/' + samples[3] + '_slow.mp3';

    let delayOn = true;
    let context = new AudioContext();

    if (samples.a !== "") {
        let audioAmb = 'audio/' + samples.a + '.mp3';
        let ambient = new Play(audioAmb, context);
        ambient.play();
    }

    let zero = new Playgroove(audioZero, context);
    zero.delaySwitch(delaySettings[0]);

    let one = new Playgroove(audioOne, context);
    one.delaySwitch(delaySettings[1]);

    let two = new Playgrain(audioTwo, context);
    two.scatter = grainSettings[0];
    two.fade = grainSettings[1];
    two.spread = grainSettings[2];
    two.feedback = grainSettings[3];

    let three = new Loop(audioThree, context);
    let threeHold = new Play(audioThreeHold, context);
    //three.delay(delaySettings[4]);

    let threePosition = 0;

    let ws = new WebSocket('ws://mikesperone.com:31296');

    let over = function(id){

        switch (id) {
            case 'zero':
                clearTimeout(zeroOut);
                zero.volume.gain.value = 1;
                break;
            case 'one':
                clearTimeout(oneOut);
                one.volume.gain.value = 0.7;
                break;
            case 'two':
                clearTimeout(twoOut);
                two.vol = 1;
                break;
            case 'three':
                clearTimeout(threeOut);
                break;
            default:
                break;
        }

    };

    function out(id){

        switch (id) {
            case 'zero':
                zeroOut = setTimeout(function(){ zero.vol(0); }, 5000);
                break;
            case 'one':
                oneOut = setTimeout(function(){ one.vol(0); }, 5000);
                break;
            case 'two':
                twoOut = setTimeout(function(){ two.vol = 0; }, 5000);
                break;
            case 'three':
                threeOut = setTimeout(function(){ three.stop(); threeHold.stop();}, 5000);
                threePosition = 0;
                break;
            default:
                break;
        }

    }

    ws.onopen = function(){
        ws.onmessage = function(e){

            let data = JSON.parse(e.data);
            //console.log(data);
            if (data.out) {
                out(data.out);
            } else if (data.over) {
                over(data.over);
            } else if (data.data) {
                //id: e.data[0]
                //value: e.data[1]
                moveHand(data.data[1], data.data[0], 'remote');

            }

        };
    };

    sensor.on("mouseover", function() {
        over(this.id);
        ws.send('{"over": "'+this.id+'"}');
    });
    sensor.on("mouseout", function() {
        out(this.id);
        ws.send('{"out": "'+this.id+'"}');

    });

    sensor.on("mousemove", function(event) {
        //event.pageX range: 60 - 400

        moveHand(event, this.id, 'local');
        //ws.send('{\"data\": ["'+this.id+'", '+event.pageX+']}');

    });

    function moveHand(event, id, src) {

        event = (src === 'local') ? event.pageX : event;
        rate = (event/270);                   // range of .225 - 1.48
        $('#'+id).children('.value').text(rate.toFixed(2));

        switch (id) {
            case 'zero':
                zero.pbRate(rate);
                if (delayOn) {
                    zero.delTime(event/485);      // range of .125 - .825(s)
                    zero.delFeedback(event/808);  // range of.075 - .495
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
                two.read = rate;
                break;
            case 'three':

                if (event > 231) {
                    console.log('entered 3.  From ' + threePosition);
                    if (threePosition !== 3) { threeHold.stop(); }
                    threePosition = 3;
                    three.sensor(event / 11);

                } else if (event < 121) {
                    console.log('entered 1.  From ' + threePosition);
                    if (threePosition !== 1) {
                        console.log('threePosition != 1');
                        if (threePosition !== 1) { threeHold.stop(); }
                        threePosition = 1;
                        three.sensor(event / 11);
                    }

                } else {
                    console.log('entered 2.  From ' + threePosition);
                    if (threePosition !== 2) {
                        three.stop();
                        threePosition = 2;
                        threeHold.vol = 1;
                        threeHold.startSample(0);
                    }

                }

                break;
            default:
                break;
        }
    }
}

