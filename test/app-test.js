var request = require('supertest');
var app = require('../app');

const getFile = function(name) {
    request(app)
        .get('audio/' + name + '.mp3')
        .expect(200)
        .end(function(error) {
            if (error) throw error;
        });
}

describe('App', function() {
    describe('Requests to the root path', function() {
        request(app)
            .get('/')
            .expect(200)
            .end(function(error) {
                if(error) throw error;
                console.log('Done');
            });
    });

    describe('Request to all audio files', function() {
        getFile("2_2_4_sheddrips");
        getFile("34sL");
        getFile("albert_tie");
        getFile("ambientcar_factory");
        getFile("ambientfactory");
        getFile("ambientthunderdrips");
        getFile("arleneNR");
        getFile("badprinter");
        getFile("badprinter2");
        getFile("bartonsifter3");
        getFile("boatreverse");
        getFile("bridgesound");
        getFile("bridgesound1");
        getFile("bridgesound3");
        getFile("bridgesound4");
        getFile("buttonholer");
        getFile("c_ray2");
        getFile("carolynNR");
        getFile("churchbells");
        getFile("counteecullen");
        getFile("crickets");
        getFile("dennisfields");
        getFile("dogsbarking");
        getFile("drillingbursts");
        getFile("elevator");
        getFile("elevator_old_mix");
        getFile("facwhistle+mock");
        getFile("facwhistle1srt");
        getFile("ferryboatbarge");
        getFile("flagpole");
        getFile("foghorn2");
        getFile("geese+gulls");
        getFile("glass_breaking");
        getFile("glass_chipping");
        getFile("glass_cutting");
        getFile("glass_ice");
        getFile("greyston2NR");
        getFile("greyston4");
        getFile("grinder");
        getFile("hangerdoor");
        getFile("hammer");
        getFile("heliocopter");
        getFile("laskyrachet");
        getFile("lenfishing");
        getFile("lensugar");
        getFile("localbirds2");
        getFile("marsh");
        getFile("metalhinge1");
        getFile("montagemachine");
        getFile("masefield1");
        getFile("masefield2");
        getFile("mockingbird");
        getFile("mockingbird2x");
        getFile("mosesyoho");
        getFile("motorboatecho");
        getFile("night");
        getFile("paintmixer");
        getFile("piano_hammer");
        getFile("piano_tuning");
        getFile("piano_tuning2");
        getFile("pigeons");
        getFile("pinningmachine");
        getFile("pno_pluck");
        getFile("rightear12");
        getFile("rightear15");
        getFile("rhythmicdrips");
        getFile("rhythmicsdrips");
        getFile("sandwalk");
        getFile("sax");
        getFile("sculpture1");
        getFile("shakesound8");
        getFile("sharonbarge");
        getFile("sidcaesar1");
        getFile("sign+bell");
        getFile("skateboardmono");
        getFile("skateboardstereo");
        getFile("springpeepers");
        getFile("tennis");
        getFile("trolley2");
        getFile("victor_glass");
        getFile("walter2");
        getFile("water1");
        getFile("water3");
        getFile("waterambient2");
        getFile("waves");
        getFile("wavebangbuf");
        getFile("wavebangbuf2");
        getFile("waveslapping");

    });        
});

