"use strict";
//Global test variable
let test;

// master controls
let context = new window.AudioContext(),
    master = context.createGain();

let zero, one, two, three, threeHold;
master.connect(context.destination);

$.getJSON("js/settings.json",
    function(json){
        console.log("settings loaded");
        let setting = Math.floor(Math.random() * 29);
        start(context, master, json, setting);
        let newSetting = function(num) {

            zero.destroy();
            one.destroy();
            two.destroy();
            three.destroy();
            threeHold.destroy();
            start(context, master, json, num);
        }
        $('#submit-setting').click(function() {
            newSetting($('#setting')[0].value);
        });
        $('#setting').val(setting);
    });

let masterMute = false;
$('#mute').click(function() {

    console.log("mute");
    let volume = (masterMute) ? 1 : 0.0001,
        color = (masterMute) ? 'green' : 'red';

    master.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.1);
    $(this).css("backgroundColor", color);
    masterMute = !masterMute;
});

$('#masterVol').on('change mousemove', function() {
    master.gain.value = $(this)[0].value/100;
});

function start(masterCtx, masterVol, settings, num) {

    /*
    * Audio setup
    */

    // Sensors
    let sensor = $('.sensor'),
        xy = $('.xy-pad'),
        rate = 1;

    let zeroOut, oneOut, twoOut, threeOut;

    // load settings
    let i = num,
        samples = settings.samples[i],
        grainSettings = settings.grain[i],
        delaySettings = settings.delay[i];

    console.log("setting number: ", (i));

    // set samples
    let audioZero = 'audio/' + samples[0] + '.mp3',
        audioOne = 'audio/' + samples[1] + '.mp3',
        audioTwo = 'audio/' + samples[2] + '.mp3',
        audioThree = 'audio/' + samples[3] + '.mp3',
        audioThreeHold = 'audio/hold/' + samples[3] + '_slow.mp3';

    let time = 0;

    let delayOn = true;

    if (samples.a !== '') {
        let audioAmb = 'audio/' + samples.a + '.mp3';
        let ambient = new Play(audioAmb, masterCtx, 0.8);
    }

    zero = new Playgroove(audioZero, masterCtx, masterVol);
    zero.delaySwitch(delaySettings[0]);

    one = new Playgroove(audioOne, masterCtx, masterVol);
    one.delaySwitch(delaySettings[1]);

    two = new Playgrain(audioTwo, masterCtx, masterVol);
    two.scatter = grainSettings[0];
    two.fade = grainSettings[1];
    two.spread = grainSettings[2];
    two.feedback = grainSettings[3];

    three = new Loop(audioThree, masterCtx, masterVol);
    threeHold = new Play(audioThreeHold, masterCtx, masterVol);
    //three.delay(delaySettings[4]);
    let threePosition = 0;

    /*
    *   Web Sockets Setup
    */
    let openConnection = false;
    let ws = new WebSocket('ws://mikesperone.com:31296');

    ws.onopen = function(){

        openConnection = true;

        ws.onmessage = function(e){

            let data = JSON.parse(e.data);
            if (data.out) {
                out(data.out);
            } else if (data.over) {
                over(data.over);
            } else if (data.data) {
                moveHand(data.data[1], data.data[0]);
            }

        };

    };

    function transmit(msg) {
        if (openConnection) {
            ws.send(msg);
        }
    }

    let over = function(id){
        switch (id) {
            case 'zero':
                zero.volume.gain.cancelScheduledValues(masterCtx.currentTime);
                zero.volume.gain.linearRampToValueAtTime(0.7, masterCtx.currentTime + 0.5);
                break;
            case 'one':
                one.volume.gain.cancelScheduledValues(masterCtx.currentTime);
                one.volume.gain.linearRampToValueAtTime(0.7, masterCtx.currentTime + 0.5);
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

    function out(id){

        switch (id) {
            case 'zero':
                zero.volume.gain.cancelScheduledValues(masterCtx.currentTime);
                zero.volume.gain.linearRampToValueAtTime(0, masterCtx.currentTime + 5.0);
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

    }

    sensor.on(
        {
            mouseenter: function () {
                over(this.id);
                transmit('{"over": "' + this.id + '"}');
            },
            mouseleave: function () {
                out(this.id);
                transmit('{"out": "' + this.id + '"}');
            },
            mousemove: function(event) {
                //event.pageX range: 60 - 400

                moveHand(event.pageX, this.id);
                transmit('{\"data\": ["'+this.id+'", '+event.pageX+']}');

            }
        }
    );

    /*
    *   xy-pad controls
    */

    let xyOffset = null;
    let quadrant = null;
    let xyWidth = 500,
        xyHeight = 500,
        xyHalfWidth = xyWidth/2,
        xyHalfHeight = xyHeight/2;

    xy.on(
        {
            mouseenter: function () {
                // TODO: create "zones" or other form of multisensor pattern
                xyOffset = xy.offset();

                over(this.id);
                // transmit('{"over": "' + this.id + '"}');
            },
            mouseleave: function () {
                out(this.id);
                // transmit('{"out": "' + this.id + '"}');
            },
            mousemove: function(event) {
                let x = event.pageX - xyOffset.left,
                    y = event.pageY - xyOffset.top;


                if (y < xyHalfHeight) {
                    // Top half
                    if (x < xyHalfWidth) {
                        // I
                        quadrant = "zero";
                    } else {
                        // II
                        x = x - xyHalfWidth;
                        quadrant = "one";
                    }
                } else {
                    // Bottom half
                    y = y - xyHalfHeight;
                    if (x > xyHalfWidth) {
                        //III
                        x = x - xyHalfWidth;
                        quadrant = "two";
                    } else {
                        //IV

                        quadrant = "three";
                    }
                }
                let distance = Math.sqrt(x*x + y*y).toFixed(2);
                //$(this).children('.value').text(quadrant + "(" + (x) + ", " + (y) + ")");
                $(this).children('.value').text(quadrant + "(" + distance + ")");
                moveHand(parseFloat(distance), quadrant);
                transmit('{\"data\": ["'+quadrant+'", '+parseFloat(distance)+']}');

            }
        }
    );


    function moveHand(event, id) {

        //event = (src === 'local') ? event.pageX : event;
        rate = (event/270);                   // range of .225 - 1.48
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
                //console.log((event-60)/360);
                two.control((event - 60)/380);
                break;
            case 'three':

                if (event > 231) {
                    if (threePosition === 2) { threeHold.stop(); }
                    threePosition = 3;
                    three.sensor(event / 11);

                } else if (event < 121) {
                    if (threePosition !== 1) {

                        time = (threePosition === 2) ? (threeHold.elapsedTime/4) : time;
                        threeHold.stop();
                        threePosition = 1;
                        three.sensor(event / 11, time);

                    }

                } else {

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
