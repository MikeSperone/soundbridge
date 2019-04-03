'use strict';
/**
 * Created by Mike on 8/25/16.
 */
import Play from './play.js';

export default class Ambient extends Play {

    constructor(audio, context) {
        super(audio, context);
        this.play();
    }

}
