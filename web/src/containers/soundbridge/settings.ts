interface Settings {
    "samples": {
        "0": string;
        "1": string;
        "2": string;
        "3": string;
        "a": string;
    }[];
    grain: number[][];
    delay: boolean[][];
};


const settings: Settings = {
    "samples": [
        {"0": "water3",         "1": "drillingbursts",  "2": "crickets",        "3":"arleneNR",       "a":""},
        {"0": "c_ray2",         "1": "c_ray2",          "2": "hammer",          "3":"carolynNR",      "a":""},
        {"0": "pno_pluck",      "1": "bridgesound1",    "2": "piano_hammer",    "3":"walter2",        "a":""},
        {"0": "rhythmicdrips",  "1": "buttonholer",     "2": "water3",          "3":"albert_tie",     "a":""},
        {"0": "glass_chipping", "1": "glass_cutting",   "2": "glass_breaking",  "3":"victor_glass",   "a":""},
        {"0": "34sL",           "1": "flagpole",        "2": "facwhistle+mock", "3":"counteecullen",  "a":""},
        {"0": "sandwalk",       "1": "laskyrachet",     "2": "rhythmicdrips",   "3":"dennisfields",   "a":""},
        {"0": "2_2_4_sheddrips", "1": "sax",            "2": "crickets",        "3":"sidcaesar1",     "a":""},
        {"0": "glass_breaking", "1": "greyston2NR",     "2": "bridgesound1",    "3":"mosesyoho",      "a":""},
        {"0": "trolley2",       "1": "pinningmachine",  "2": "facwhistle+mock", "3":"masefield1",     "a":""},
        {"0": "montagemachine", "1": "facwhistle1srt",  "2": "buttonholer",     "3":"masefield2",     "a":""},
        {"0": "bridgesound1",   "1": "water1",          "2": "rhythmicdrips",  "3":"sharonbarge",    "a":""},
        {"0": "piano_tuning",   "1": "glass_ice",       "2": "glass_breaking",  "3":"mockingbird",    "a":"ambientcar_factory"},
        {"0": "wavebangbuf",    "1": "bridgesound1",    "2": "metalhinge1",     "3":"piano_tuning2",  "a":"ambientfactory"},
        {"0": "pno_pluck",      "1": "bridgesound3",    "2": "piano_hammer",    "3":"elevator",       "a":"marsh"},
        {"0": "sax",            "1": "skateboardstereo", "2": "boatreverse",    "3":"elevator_old_mix", "a":"night"},
        {"0": "greyston4",      "1": "rightear12",      "2": "sign+bell",       "3":"badprinter",     "a":"heliocopter"},
        {"0": "night",          "1": "34sL",            "2": "heliocopter",     "3":"hangerdoor",     "a":"waterambient2"},
        {"0": "tennis",         "1": "waves",           "2": "churchbells",     "3":"mockingbird2x",  "a":"farmersmarcket"},
        {"0": "motorboatecho",  "1": "grinder",         "2": "heliocopter",     "3":"skateboardmono", "a":"waveslapping"},
        {"0": "pigeons",        "1": "localbirds2",     "2": "geese+gulls",     "3":"sculpture1",     "a":"springpeepers"},
        {"0": "bartonsifter3",  "1": "foghorn2",        "2": "pno_pluck",       "3":"heliocopter",    "a":"ambientfactory"},
        {"0": "bridgesound4",   "1": "foghorn2",        "2": "foghorn2",        "3":"waveslapping",   "a":"ambientthunderdrips"},
        {"0": "rightear15",     "1": "rightear15",      "2": "bridgesound",     "3":"pno_pluck",      "a":"crickets"},
        {"0": "churchbells",    "1": "crickets",        "2": "geese+gulls",     "3":"lenfishing",     "a":""},
        {"0": "paintmixer",     "1": "montagemachine",  "2": "elevator",        "3":"lensugar",       "a":""},
        {"0": "bridgesound3",   "1": "pno_pluck",       "2": "drillingbursts",  "3":"mockingbird2x",  "a":""},
        {"0": "badprinter",     "1": "shakesound8",     "2": "wavebangbuf2",    "3":"localbirds2",    "a":""},
        {"0": "dogsbarking",    "1": "ferryboatbarge",  "2": "pno_pluck",       "3":"badprinter2",    "a":""},
        {"0": "greyston2NR",    "1": "bridgesound3",    "2": "geese+gulls",     "3":"sculpture1",     "a":""}
    ],
    "grain": [
        [28, 1, 2, 0.2],
        [28, 9, 2, 0.2],
        [39, 9, 2, 0.2],
        [18, 9, 2, 0.2],
        [39, 9, 2, 0.2],
        [39, 9, 2, 0.2],
        [28, 1, 2, 0.2],
        [28, 1, 2, 0.2],
        [39, 9, 2, 0.1],
        [39, 9, 2, 0.2],
        [73, 9, 4, 0.0],
        [28, 1, 2, 0.2],
        [39, 9, 2, 0.2],
        [39, 9, 2, 0.1],
        [39, 9, 2, 0.2],
        [39, 14,4, 0.0],
        [73, 3, 2, 0.2],
        [73, 9, 4, 0.2],
        [11, 35,5, 0.1],
        [73, 9, 4, 0.2],
        [39, 28,2, 0.2],
        [28, 1, 2, 0.0],
        [39, 9, 2, 0.4],
        [39, 9, 2, 0.1],
        [39, 28,2, 0.2],
        [28, 14,3, 0.4],
        [28, 1, 2, 0.2],
        [28, 1, 2, 0.0],
        [28, 1, 2, 0.0],
        [39, 28, 2, 0.2]
    ],
    "delay": [
        //0    | 1   | 2    | 3
        //------------------------
        //     |     |unused|
        [false, true, false, false],
        [true,  true, false, false],
        [true,  true, false, true],
        [true,  false,false, true],
        [true,  true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [true,  true, false, false],
        [false, false,false, false],
        [true,  true, false, true],
        [true,  false,false, false],
        [true,  false,false, false],
        [true,  true, false, false],
        [false, false,false, false],
        [false, false,false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, false,false, false],
        [true,  false,false, false],
        [false, true, false, false],
        [false, false,false, false],
        [false, true, false, true],
        [true,  true, false, false],
        [false, false,false, true],
        [true,  true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, true],
        [true, true,  false, true],
        [true, true,  false, true]
    ]
};
Object.freeze(settings); 

export default function getSettings(i: number) {
    console.info('getting settings');

    const samples = settings.samples[i],
        grain = settings.grain[i],
        delay = settings.delay[i];

    return { samples, grain, delay };
}
