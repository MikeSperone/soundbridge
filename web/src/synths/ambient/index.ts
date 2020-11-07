'use strict';
/**
 * Created by Mike on 8/25/16.
 */
import Play from 'synths/play';

export default class Ambient extends Play {

    constructor(audio: string, context: AudioContext) {
        super(audio, context);
        this.play();
    }

}
