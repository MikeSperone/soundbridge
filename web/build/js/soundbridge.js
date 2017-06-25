"use strict";

var DEBUG = true;
var openConnection = false;
var ws = typeof io !== "undefined" ? io() : false;

if (ws) {
    ws.on('setting', function (i) {
        console.log("server ready");
        openConnection = true;
        $.getJSON("js/settings.json", function (json) {
            var settings = setSettings(json, i);
            console.log("settings loaded");
            start(settings);
        });
    });
} else {
    // allow ws.on() functions to be called with no error
    ws = { on: function on(a, b) {} };
    console.warn("No server, Solo Mode");
    openConnection = false;
    $.getJSON("js/settings.json", function (json) {
        var i = Math.floor(Math.random() * 29);
        var settings = setSettings(json, i);
        console.log("settings loaded");
        start(settings);
    });
}

console.log = function (s) {
    var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (DEBUG) {
        if (o !== '') {
            console.debug(s, o);
        } else {
            console.debug(s);
        }
    }
};

function setSettings(settings, i) {

    console.log("setting number: ", i + 1);

    var samples = settings.samples[i],
        grainSettings = settings.grain[i],
        delaySettings = settings.delay[i];

    return { samples: samples, grain: grainSettings, delay: delaySettings };
}

function start(settings) {

    var audiopath = 'audio/';
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
    var samples = settings.samples;
    var grainSettings = settings.grain;
    var delaySettings = settings.delay;

    // set samples
    var audioZero = audiopath + samples[0] + '.mp3';
    var audioOne = audiopath + samples[1] + '.mp3';
    var audioTwo = audiopath + samples[2] + '.mp3';
    var audioThree = audiopath + samples[3] + '.mp3';
    var audioThreeHold = audiopath + 'hold/' + samples[3] + '_slow.mp3';

    var time = 0;

    var delayOn = true;
    var context = new window.AudioContext();

    if (samples.a !== "") {
        var audioAmb = audiopath + samples.a + '.mp3';
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

    ws.on('out', function (d) {
        out(d);
    });

    ws.on('over', function (d) {
        over(d);
    });

    ws.on('data', function (d) {
        moveHand(d[1], d[0], 'remote');
    });

    function transmit(dest, msg) {
        if (openConnection) {
            console.log("transmitting message to " + dest);
            ws.emit(dest, msg);
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

    var out = function out(id) {

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
    };

    sensor.on({
        mouseenter: function mouseenter() {
            over(this.id);
            transmit("over", this.id);
        },
        mouseleave: function mouseleave() {
            out(this.id);
            transmit("out", this.id);
        },
        mousemove: function mousemove(event) {
            //console.log(event.offsetX);
            //event.pageX range: 60 - 400
            moveHand(event.offsetX + 1, this.id, 'local');
            transmit("data", [this.id, event.offsetX + 1]);
        }
    });
    /*
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
                    moveHand(parseFloat(distance), quadrant, 'xy');
                    transmit('{\"data\": ["'+quadrant+'", '+parseFloat(distance)+']}');
    
                }
            }
        );
    
    */
    function moveHand(event, id, src) {

        //event = (src === 'local') ? event.offsetX : event;
        var rate = event / 270; // range of .225 - 1.48
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
                // range: 0 - 1
                two.read = event / 360;
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