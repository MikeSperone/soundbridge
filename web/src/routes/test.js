import { h, Component } from 'preact';
import grainread from 'synths/grainread/index.spec.js';
import loop from 'synths/loop/index.spec.js';
import play from 'synths/play/index.spec.js';
import playgrain from 'synths/playgrain/index.spec.js';
import playgroove from 'synths/playgroove/index.spec.js';

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
        mocha.setup('bdd');
        mocha.checkLeaks();
        // mocha.globals(['jQuery']);
        grainread();
        loop();
        play();
        playgrain();
        playgroove();
        mocha.run();
    }

    componentDidMount() {
        const p = [];
        const expect = "https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"
        const chai = "https://cdnjs.cloudflare.com/ajax/libs/chai/4.1.1/chai.min.js"
        const mocha = "https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js";
        p.push(this.injectScript(mocha));
        p.push(this.injectScript(chai));
        p.push(this.injectScript(expect));
        Promise.all(p)
            .then(this.test);
    }

    render() {
        return (
            <div id="test-div">
                <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
                <div id="mocha"></div>
            </div>
        );
    }
}
