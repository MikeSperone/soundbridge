const mocha = require('mocha');
mocha.setup('bdd');

require('./modules/play-class-test.js');
require('./modules/loop-test.js');
require('./modules/playgroove-test.js');
require('./modules/grainread-test.js');
require('./modules/playgrain-test.js');
require('./modules/soundbridge-test.js');

mocha.checkLeaks();
mocha.globals(['jQuery']);
mocha.run();
