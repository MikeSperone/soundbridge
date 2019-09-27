import { setSettings, start } from './soundbridge';
import * as json from './settings';

var openConnection = false;

function startWithSettings(ws, i) {
    const settings = setSettings(json.settings, i);
    start(settings, ws, openConnection);
}

function soloStart() {
    const soloBox = document && document.getElementById('solo-box');
    if (!!soloBox) soloBox.style = 'display: block';
    const i = Math.floor(Math.random() * 29);
    const ws = {};
    ws.on = (a,b) => {};
    startWithSettings(ws, i);
}

function init() {
    const ioScript = document.createElement('script');
    ioScript.type = 'text/javascript';
    ioScript.src = '/socket.io/socket.io.js';
    ioScript.onload = () => {
        if (typeof io !== "function") return soloStart();

        const ws = io();
        ws.on('setting', function(n) {
            openConnection = true;
            startWithSettings(ws, n);
        });
    };
    ioScript.onerror = soloStart;

    document.getElementsByTagName('head')[0].appendChild(ioScript);

}

setTimeout(init, 10000);
// init();
