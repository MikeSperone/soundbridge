/**
 * Created by Mike on 8/29/16.
 */
'use strict';

let audioAmb = 'audio/ambientcar_factory.m4a';
let context = new AudioContext();

let amb = new Ambient(audioAmb, context);

console.log(amb.toString());