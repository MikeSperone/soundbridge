import { h, Component } from 'preact';
import mocha from 'mocha';
import chai from 'chai';
import grainread from 'synths/grainread/index.spec.js';
import loop from 'synths/loop/index.spec.js';
import play from 'synths/play/index.spec.js';
import playgrain from 'synths/playgrain/index.spec.js';
import playgroove from 'synths/playgroove/index.spec.js';

export default class Test extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        mocha.setup('bdd');
        mocha.checkLeaks();
        mocha.globals(['jQuery']);
        grainread();
        loop();
        play();
        playgrain();
        playgroove();
        mocha.run();
    }

    render() {
        return (
            <div id="test-div">
                <div id="mocha"></div>
            </div>
        );
    }
}
