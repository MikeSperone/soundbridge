import { setSettings } from '../src/js/soundbridge.js';
import * as json from '../src/js/settings.js';
import Play from '../src/js/play.js';
import Loop from '../src/js/loop.js';
import Playgroove from '../src/js/playgroove.js';
import Grainread from '../src/js/grainread.js';
import Playgrain from '../src/js/playgrain.js';

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;


function getFile(name) {
    return new Promise((resolve, reject) => {

        let req = new XMLHttpRequest();
        let result = false;

        req.open('GET', "audio/" + name + ".mp3");
        req.responseType = 'arraybuffer';

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 2) {
                    resolve();
                } else {
                    reject();
                }
            }
        };

        req.send();
    });
}

describe('Soundbridge', function() {
	
	describe("setSettings()", function() {

		it('should soundbridge', function() {
			return true;
		});

		it('should return the correct settings', function() {

			const settings = setSettings(json.settings, 0);
			expect(settings).to.deep.equal({
                samples: {
                    "0": "water3",
                    "1": "drillingbursts",
                    "2": "crickets",
                    "3":"arleneNR",
                    "a":""
                },
                grain: [28, 1, 2, 0.2],
                delay: [false, true, [], false]
            });
		});
	});

    describe("audio files", function() {
        it('should all exist', function() {

            return Promise.all([
                expect(getFile("2_2_4_sheddrips")).to.be.fulfilled,
                expect(getFile("34sL")).to.be.fulfilled,
                expect(getFile("albert_tie")).to.be.fulfilled,
                expect(getFile("ambientcar_factory")).to.be.fulfilled,
                expect(getFile("ambientfactory")).to.be.fulfilled,
                expect(getFile("ambientthunderdrips")).to.be.fulfilled,
                expect(getFile("arleneNR")).to.be.fulfilled,
                expect(getFile("badprinter")).to.be.fulfilled,
                expect(getFile("badprinter2")).to.be.fulfilled,
                expect(getFile("bartonsifter3")).to.be.fulfilled,
                expect(getFile("boatreverse")).to.be.fulfilled,
                expect(getFile("bridgesound")).to.be.fulfilled,
                expect(getFile("bridgesound1")).to.be.fulfilled,
                expect(getFile("bridgesound3")).to.be.fulfilled,
                expect(getFile("bridgesound4")).to.be.fulfilled,
                expect(getFile("buttonholer")).to.be.fulfilled,
                expect(getFile("c_ray2")).to.be.fulfilled,
                expect(getFile("carolynNR")).to.be.fulfilled,
                expect(getFile("churchbells")).to.be.fulfilled,
                expect(getFile("counteecullen")).to.be.fulfilled,
                expect(getFile("crickets")).to.be.fulfilled,
                expect(getFile("dennisfields")).to.be.fulfilled,
                expect(getFile("dogsbarking")).to.be.fulfilled,
                expect(getFile("drillingbursts")).to.be.fulfilled,
                expect(getFile("elevator")).to.be.fulfilled,
                expect(getFile("elevator_old_mix")).to.be.fulfilled,
                expect(getFile("facwhistle+mock")).to.be.fulfilled,
                expect(getFile("facwhistle1srt")).to.be.fulfilled,
                expect(getFile("ferryboatbarge")).to.be.fulfilled,
                expect(getFile("flagpole")).to.be.fulfilled,
                expect(getFile("foghorn2")).to.be.fulfilled,
                expect(getFile("geese+gulls")).to.be.fulfilled,
                expect(getFile("glass_breaking")).to.be.fulfilled,
                expect(getFile("glass_chipping")).to.be.fulfilled,
                expect(getFile("glass_cutting")).to.be.fulfilled,
                expect(getFile("glass_ice")).to.be.fulfilled,
                expect(getFile("greyston2NR")).to.be.fulfilled,
                expect(getFile("greyston4")).to.be.fulfilled,
                expect(getFile("grinder")).to.be.fulfilled,
                expect(getFile("hangerdoor")).to.be.fulfilled,
                expect(getFile("hammer")).to.be.fulfilled,
                expect(getFile("heliocopter")).to.be.fulfilled,
                expect(getFile("laskyrachet")).to.be.fulfilled,
                expect(getFile("lenfishing")).to.be.fulfilled,
                expect(getFile("lensugar")).to.be.fulfilled,
                expect(getFile("localbirds2")).to.be.fulfilled,
                expect(getFile("marsh")).to.be.fulfilled,
                expect(getFile("metalhinge1")).to.be.fulfilled,
                expect(getFile("montagemachine")).to.be.fulfilled,
                expect(getFile("masefield1")).to.be.fulfilled,
                expect(getFile("masefield2")).to.be.fulfilled,
                expect(getFile("mockingbird")).to.be.fulfilled,
                expect(getFile("mockingbird2x")).to.be.fulfilled,
                expect(getFile("mosesyoho")).to.be.fulfilled,
                expect(getFile("motorboatecho")).to.be.fulfilled,
                expect(getFile("night")).to.be.fulfilled,
                expect(getFile("paintmixer")).to.be.fulfilled,
                expect(getFile("piano_hammer")).to.be.fulfilled,
                expect(getFile("piano_tuning")).to.be.fulfilled,
                expect(getFile("piano_tuning2")).to.be.fulfilled,
                expect(getFile("pigeons")).to.be.fulfilled,
                expect(getFile("pinningmachine")).to.be.fulfilled,
                expect(getFile("pno_pluck")).to.be.fulfilled,
                expect(getFile("rightear12")).to.be.fulfilled,
                expect(getFile("rightear15")).to.be.fulfilled,
                expect(getFile("rhythmicdrips")).to.be.fulfilled,
                expect(getFile("rhythmicsdrips")).to.be.fulfilled,
                expect(getFile("sandwalk")).to.be.fulfilled,
                expect(getFile("sax")).to.be.fulfilled,
                expect(getFile("sculpture1")).to.be.fulfilled,
                expect(getFile("shakesound8")).to.be.fulfilled,
                expect(getFile("sharonbarge")).to.be.fulfilled,
                expect(getFile("sidcaesar1")).to.be.fulfilled,
                expect(getFile("sign+bell")).to.be.fulfilled,
                expect(getFile("skateboardmono")).to.be.fulfilled,
                expect(getFile("skateboardstereo")).to.be.fulfilled,
                expect(getFile("springpeepers")).to.be.fulfilled,
                expect(getFile("tennis")).to.be.fulfilled,
                expect(getFile("trolley2")).to.be.fulfilled,
                expect(getFile("victor_glass")).to.be.fulfilled,
                expect(getFile("walter2")).to.be.fulfilled,
                expect(getFile("water1")).to.be.fulfilled,
                expect(getFile("water3")).to.be.fulfilled,
                expect(getFile("waterambient2")).to.be.fulfilled,
                expect(getFile("waves")).to.be.fulfilled,
                expect(getFile("wavebangbuf")).to.be.fulfilled,
                expect(getFile("wavebangbuf2")).to.be.fulfilled,
                expect(getFile("waveslapping")).to.be.fulfilled
            ]);

        });
    });

            
});



describe('Play Class', function() {

    const audio = '../build/audio/arlene.mp3';
    const context = new AudioContext();
    let XMLHttpRequest = global.XMLHttpRequest;
    var testing = new Play(audio, context);

    describe('initial state', function() {

        it('should start a new instance', function() {
            return testing;
        });

        it('should begin at position 0', function() {
            expect(testing.position).to.equal(0);
        });

        it('should be stopped', function() {
            expect(testing.stopped).to.be.true;
        });
        
    });

    describe('Starting Settings', function() {

        it('volume', function() {
            testing.vol(0.8);
            expect(testing.vol).to.equal(0.8);
        });

        it('startSample', function() {
            testing.startSample(0);
            expect(testing.stopped).to.be.false;
        });

        it('should have a duration', function() {
            return true;
            //expect(testing.duration).to.equal(1); 
        });

    });
});



describe('Loop Class', function() {

	it('should start a new instance', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Loop(audio, context);
	});
});


describe('Playgroove Class', function() {

	it('should start a new instance', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgroove(audio, context);
	});
});


describe('Grainread Class', function() {

	it('should start a new grainread class', function() {

        let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Grainread(audio, context, 1);
	});
});


describe('Playgrain Class', function() {

	it('should start a new play class', function() {
		let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Playgrain(audio, context);
	});

});
