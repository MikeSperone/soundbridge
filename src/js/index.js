import {setSettings, start} from './soundbridge.js';
import * as json from './settings.js';


const DEBUG = true;

let openConnection = false;
let ws = (typeof io !== "undefined") ? io() : false;
let i;

function getServerData() {
    return new Promise((resolve, reject) => { 
        if (ws) {
            ws.on('setting', function(n) {
                openConnection = true;
                i = n;
                return resolve("Connection open.  Server ready.");
            });
        } else {
            // allow ws.on() functions to be called with no error
            i = Math.floor(Math.random() * 29);
            ws = { on: function(a, b) {} };
            return resolve("No Server.  Solo Mode");
        }
    });
}

getServerData().then(message => {
    console.log(message);
    const settings = setSettings(json.settings, i);
    console.log("settings loaded");

    if (typeof window !== "undefined") {
        var $ = require("jquery");
        start(settings, ws, openConnection);
    }
});

// console.log = function(s, o=''){
//     if (DEBUG) {
//         if (o !== '') {
//             console.debug(s, o);
//         } else {
//             console.debug(s);
//         }
//     }
// };
