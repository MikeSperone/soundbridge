import { h, Component } from 'preact';

import grainread_test  from 'synths/grainread/index.spec.js';
import loop_test       from 'synths/loop/index.spec.js';
import play_test       from 'synths/play/index.spec.js';
import playgrain_test  from 'synths/playgrain/index.spec.js';
import playgroove_test from 'synths/playgroove/index.spec.js';
import clip_test       from 'synths/utils/clip.spec.js';

export default class Test extends Component {
    constructor() {
        super();
    }

    injectScript(src) {
        return new Promise((resolve, reject) => {
            console.info('injecting script');
            const s = document.createElement('script');
            s.async = true;
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    test() {
        console.info('testing');
        console.info('audio context: ', window.AudioContext);
        mocha.setup('bdd');
        mocha.checkLeaks();
        grainread_test();
        loop_test();
        play_test();
        playgrain_test();
        playgroove_test();
        clip_test();
        mocha.run();
    }

    componentDidMount() {
        const expect = "https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"
        const chai = "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.5/chai.min.js";
        const mocha = "https://cdnjs.cloudflare.com/ajax/libs/mocha/9.1.4/mocha.min.js";
        Promise.all([
            this.injectScript(mocha),
            this.injectScript(chai),
            this.injectScript(expect),
        ]).then(this.test);
    }

    render() {
        return (
            <div id="test-div">
                <link href="https://cdn.rawgit.com/mochajs/mocha/9.1.4/mocha.css" rel="stylesheet" />
                <div id="mocha"></div>
            </div>
        );
    }
}
