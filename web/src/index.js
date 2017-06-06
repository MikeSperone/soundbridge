/**
 * Created by Mike on 8/28/16.
 */

"use strict";
var sensor = document.getElementsByClassName('sensor');
var rate = 1;

var audioZero = 'audio/34sL.m4a';
var audioOne = 'audio/badprinter.m4a';
var audioTwo = '';
var audioThree = '';
var audioAmb = 'audio/ambientcar_factory.m4a';
// TODO: load audio samples from array

var delayOn = true;
var zeroOut, oneOut;

var context = new AudioContext();

ambient(audioAmb);
