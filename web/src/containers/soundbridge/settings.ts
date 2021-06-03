interface Setting {
    "zero": {
        sample: string;
        delay: boolean;
    },
    "one": {
        sample: string;
        delay: boolean;
    }
    "two": {
        sample: string;
        delay: boolean;
        grain: number[];
    }
    "three": {
        sample: string;
        delay: boolean;
        grain: number[];
    }
}

const settings: Setting[] = [
    {
        zero:  { sample: "rhythmicdrips", delay: true },
        one:   { sample: "buttonholer",   delay: false },
        two:   { sample: "drillingburst", delay: false, grain: [18, 9, 2, 0.2] },
        three: { sample: "albert_tie",    delay: true, grain: [18, 9, 2, 0.2] }
    },
    {
        zero:    { sample: "glass_chipping", delay: true },
        one:   { sample: "glass_cutting", delay: true },
        two:   { sample: "glass_breaking", delay: false, grain: [39, 9, 2, 0.2] },
        three: { sample: "victor_glass", delay: false, grain: [39, 9, 2, 0.2] },
    },
    {
        zero:    { sample:  "churchbells", delay: true },
        one:   { sample:  "laskyrachet", delay: true },
        two:   { sample:  "rhythmicdrips", delay: false, grain: [28, 1, 2, 0.2] },
        three: { sample:  "dennisfields", delay: false, grain: [28, 1, 2, 0.2] },
    },
    {
        zero:    { sample: "2_2_4_sheddrips", delay: true },
        one:   { sample: "sax", delay: true },
        two:   { sample: "elevator_old_mix", delay: false, grain: [28, 1, 2, 0.2] },
        three: { sample: "sidcaesar1", delay: false, grain: [28, 1, 2, 0.2] },
    },
    {
        zero:    { sample: "pno_pluck", delay: false },
        one:   { sample: "bridgesound3", delay: false },
        two:   { sample: "piano_hammer", delay: false, grain: [39, 9, 2, 0.2] },
        three: { sample: "elevator", delay: false, grain: [39, 9, 2, 0.2] },
    },
    {
        zero:    { sample:  "greyston4", delay: false },
        "one":   { sample:  "rightear12", delay: true },
        "two":   { sample:  "sign+bell", delay: false, grain: [73, 3, 2, 0.2] },
        "three": { sample:  "arlene2", delay: false, grain: [73, 3, 2, 0.2] },
    },
    {
        zero:    { sample: "badprinter", delay: false },
        "one":   { sample: "localbirds2", delay: true },
        "two":   { sample: "wavebangbuf2", delay: false, grain: [28, 1, 2, 0.0] },
        "three": { sample: "carolynray2", delay: true, grain: [28, 1, 2, 0.0] },
    },
    {
        zero:    { sample: "dogsbarking", delay: true },
        "one":   { sample: "ferryboatbarge", delay: true },
        "two":   { sample: "pno_pluck", delay: false, grain: [28, 1, 2, 0.0] },
        "three": { sample: "badprinter2", delay: true, grain: [28, 1, 2, 0.0] },
    }
];
Object.freeze(settings); 

export default settings;
