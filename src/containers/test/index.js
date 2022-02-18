import grainread_test  from 'synths/grainread/index.spec.js';
import loop_test       from 'synths/loop/index.spec.js';
import play_test       from 'synths/play/index.spec.js';
// import playgrain_test  from 'synths/playgrain/index.spec.js';
import playgroove_test from 'synths/playgroove/index.spec.js';
import clip_test       from 'synths/utils/clip.spec.js';

export default function test() {
    mocha.setup({
        globals: [
            '__REACT_DEVTOOLS_APPEND_COMPONENT_STACK__',
			'__REACT_DEVTOOLS_BREAK_ON_CONSOLE_ERRORS__',
			'__REACT_DEVTOOLS_COMPONENT_FILTERS__',
			'__REACT_DEVTOOLS_SHOW_INLINE_WARNINGS_AND_ERRORS__',
			'__REACT_DEVTOOLS_HIDE_CONSOLE_LOGS_IN_STRICT_MODE__',
			'__REACT_DEVTOOLS_BROWSER_THEME__'
        ],
        ui: 'bdd'
    })
    mocha.growl();
    mocha.checkLeaks();
    grainread_test();
    loop_test();
    play_test();
    // playgrain_test();
    playgroove_test();
    clip_test();
    mocha.run();
}
