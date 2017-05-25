"use strict";
//Global test variable

var test = void 0;
$.getJSON("js/settings.json", function (json) {
    console.log("settings loaded");
    start(json);
});

function start(settings) {

    /*
    * Audio setup
    */

    // Sensors
    var sensor = $('.sensor');
    var xy = $('.xy-pad');
    var rate = 1;
    var zeroOut = void 0,
        oneOut = void 0,
        twoOut = void 0,
        threeOut = void 0;

    // load settings
    var i = Math.floor(Math.random() * 29);
    var samples = settings.samples[i];
    var grainSettings = settings.grain[i];
    var delaySettings = settings.delay[i];

    console.log("setting number: ", i + 1);

    // set samples
    var audioZero = 'audio/' + samples[0] + '.mp3';
    var audioOne = 'audio/' + samples[1] + '.mp3';
    var audioTwo = 'audio/' + samples[2] + '.mp3';
    var audioThree = 'audio/' + samples[3] + '.mp3';
    var audioThreeHold = 'audio/hold/' + samples[3] + '_slow.mp3';

    var time = 0;

    var delayOn = true;
    var context = new window.AudioContext();

    if (samples.a !== "") {
        var audioAmb = 'audio/' + samples.a + '.mp3';
        var ambient = new Play(audioAmb, context, 0.8);
    }

    var zero = new Playgroove(audioZero, context);
    zero.delaySwitch(delaySettings[0]);

    var one = new Playgroove(audioOne, context);
    one.delaySwitch(delaySettings[1]);

    var two = new Playgrain(audioTwo, context);
    two.scatter = grainSettings[0];
    two.fade = grainSettings[1];
    two.spread = grainSettings[2];
    two.feedback = grainSettings[3];

    var three = new Loop(audioThree, context);
    var threeHold = new Play(audioThreeHold, context);
    //three.delay(delaySettings[4]);

    var threePosition = 0;

    var openConnection = false;
    var ws = new WebSocket('ws://mikesperone.com:31296');

    ws.onopen = function () {

        openConnection = true;

        ws.onmessage = function (e) {

            var data = JSON.parse(e.data);
            if (data.out) {
                out(data.out);
            } else if (data.over) {
                over(data.over);
            } else if (data.data) {

                moveHand(data.data[1], data.data[0], 'remote');
            }
        };
    };

    function transmit(msg) {
        if (openConnection) {
            ws.send(msg);
        }
    }

    var over = function over(id) {
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

    function out(id) {

        switch (id) {
            case 'zero':
                zero.volume.gain.cancelScheduledValues(context.currentTime);
                zero.volume.gain.linearRampToValueAtTime(0, context.currentTime + 5.0);
                break;
            case 'one':
                oneOut = setTimeout(function () {
                    one.vol(0);
                }, 5000);
                break;
            case 'two':
                twoOut = setTimeout(function () {
                    two.stop();
                }, 5000);
                break;
            case 'three':
                setTimeout(function () {
                    three.stop();threeHold.stop();
                }, 5000);
                threePosition = 0;
                break;
            default:
                break;
        }
    }

    sensor.on({
        mouseenter: function mouseenter() {
            over(this.id);
            transmit('{"over": "' + this.id + '"}');
        },
        mouseleave: function mouseleave() {
            out(this.id);
            transmit('{"out": "' + this.id + '"}');
        },
        mousemove: function mousemove(event) {
            //event.pageX range: 60 - 400

            moveHand(event, this.id, 'local');
            transmit('{\"data\": ["' + this.id + '", ' + event.pageX + ']}');
        }
    });

    var xyOffset = null;
    var quadrant = null;
    var xyWidth = 500,
        xyHeight = 500,
        xyHalfWidth = xyWidth / 2,
        xyHalfHeight = xyHeight / 2;

    xy.on({
        mouseenter: function mouseenter() {
            // TODO: create "zones" or other form of multisensor pattern
            xyOffset = xy.offset();

            over(this.id);
            // transmit('{"over": "' + this.id + '"}');
        },
        mouseleave: function mouseleave() {
            out(this.id);
            // transmit('{"out": "' + this.id + '"}');
        },
        mousemove: function mousemove(event) {
            var x = event.pageX - xyOffset.left,
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
            var distance = Math.sqrt(x * x + y * y).toFixed(2);
            //$(this).children('.value').text(quadrant + "(" + (x) + ", " + (y) + ")");
            $(this).children('.value').text(quadrant + "(" + distance + ")");
            moveHand(parseFloat(distance), quadrant, 'xy');
            transmit('{\"data\": ["' + quadrant + '", ' + parseFloat(distance) + ']}');
        }
    });

    function moveHand(event, id, src) {

        event = src === 'local' ? event.pageX : event;
        rate = event / 270; // range of .225 - 1.48
        $('#' + id).children('.value').text(rate.toFixed(2));

        switch (id) {
            case 'zero':
                zero.pbRate(rate);
                if (delayOn) {
                    zero.delTime(event / 485); // range of .125 - .825(s)
                    zero.delFeedback(event / 808); // range of .075 - .495
                }
                break;
            case 'one':
                one.pbRate(rate);
                if (delayOn) {
                    one.delTime(event / 485);
                    one.delFeedback(event / 808);
                }
                break;
            case 'two':
                console.log((event - 60) / 360);
                two.read = (event - 60) / 360;
                break;
            case 'three':

                if (event > 231) {
                    console.log('entered 3.  From ' + threePosition);
                    if (threePosition === 2) {
                        threeHold.stop();
                    }
                    threePosition = 3;
                    three.sensor(event / 11);
                } else if (event < 121) {
                    console.log('entered 1.  From ' + threePosition);
                    if (threePosition !== 1) {

                        time = threePosition === 2 ? threeHold.elapsedTime / 4 : time;
                        threeHold.stop();
                        threePosition = 1;
                        three.sensor(event / 11, time);
                    }
                } else {
                    console.log('entered 2.  From ' + threePosition);
                    if (threePosition !== 2) {
                        time = threePosition === 1 ? three.elapsedTime * 4 : time;
                        if (threePosition !== 0) {
                            three.stop();
                        }
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