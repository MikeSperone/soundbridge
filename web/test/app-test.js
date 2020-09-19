var request = require('supertest');
var app = require('../app');

describe('App', function() {

    it('Requests to the root path', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(function(error) {
                if(error) throw error;
                done();
            });
    });

    it('Request to non-existant file throws a 404', function(done) {
        request(app)
            .get('/audio/fake_aiuhsf.mp3')
            .expect(404)
            .end(function(error) {
                if (error) throw error;
                done();
            });
    });

    describe("Audio Files", function() {
        const audioFiles = [
            "2_2_4_sheddrips",
            "34sL",
            "albert_tie",
            "ambientcar_factory",
            "ambientfactory",
            "ambientthunderdrips",
            "arleneNR",
            "badprinter",
            "badprinter2",
            "bartonsifter3",
            "boatreverse",
            "bridgesound",
            "bridgesound1",
            "bridgesound3",
            "bridgesound4",
            "buttonholer",
            "c_ray2",
            "carolynNR",
            "churchbells",
            "counteecullen",
            "crickets",
            "dennisfields",
            "dogsbarking",
            "drillingbursts",
            "elevator",
            "elevator_old_mix",
            "facwhistle+mock",
            "facwhistle1srt",
            "ferryboatbarge",
            "flagpole",
            "foghorn2",
            "geese+gulls",
            "glass_breaking",
            "glass_chipping",
            "glass_cutting",
            "glass_ice",
            "greyston2NR",
            "greyston4",
            "grinder",
            "hangerdoor",
            "hammer",
            "heliocopter",
            "laskyrachet",
            "lenfishing",
            "lensugar",
            "localbirds2",
            "marsh",
            "metalhinge1",
            "montagemachine",
            "masefield1",
            "masefield2",
            "mockingbird",
            "mockingbird2x",
            "mosesyoho",
            "motorboatecho",
            "night",
            "paintmixer",
            "piano_hammer",
            "piano_tuning",
            "piano_tuning2",
            "pigeons",
            "pinningmachine",
            "pno_pluck",
            "rightear12",
            "rightear15",
            "rhythmicdrips",
            "rhythmicsdrips",
            "sandwalk",
            "sax",
            "sculpture1",
            "shakesound8",
            "sharonbarge",
            "sidcaesar1",
            "sign+bell",
            "skateboardmono",
            "skateboardstereo",
            "springpeepers",
            "tennis",
            "trolley2",
            "victor_glass",
            "walter2",
            "water1",
            "water3",
            "waterambient2",
            "waves",
            "wavebangbuf",
            "wavebangbuf2",
            "waveslapping"
        ];

        audioFiles.forEach(function(a) {
            it(a, function(done) {
                request(app)
                    .get('/audio/' + a + '.mp3')
                    .expect(200)
                    .end(function(error) {
                        if (error) throw error;
                        done();
                    });
            });
        });
    });
});

