import * from './soundbridge.js';
import * as json from './settings.js';

(function() {
    
    const DEBUG = true;

    let openConnection = false;
    let ws = (typeof io !== "undefined") ? io() : false;
    let i = 18; //Math.floor(Math.random() * 29);

    if (ws) {
        ws.on('setting', function(n) {
            console.log("server ready");
            openConnection = true;
            i = n;
        });
    } else {
        // allow ws.on() functions to be called with no error
        ws = { on: function(a, b) {} };
        console.warn("No server, Solo Mode");
    }

    const settings = setSettings(json.settings, i);
    console.log("settings loaded");

    if (typeof window !== "undefined") {
        var $ = require("jquery"); 
        start(settings);
    }

    console.log = function(s, o=''){
        if (DEBUG) {
            if (o !== '') {
                console.debug(s, o);
            } else {
                console.debug(s);
            }
        }
    };
})();

