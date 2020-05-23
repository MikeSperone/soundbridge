import Loop from 'synths/loop';

describe('Loop Class', function() {

	let audio = '/audio/arlene.mp3';
	let context = new AudioContext();
	let lp = new Loop(audio, context);

    before(function(done) {
        lp.loadAudio().then(() => done());
    });

	it('should start a new instance', function() {
		expect(lp).to.exist;
	});
	
	it('starts a loop at the correct spot', function() {
		lp.loop(22);
		expect(lp.position).to.equal(lp.duration * 0.3);
	});

	it('turns the delay on', function() {
		//lp.delaySwitch(true);
		//expect()... delay to be on
		
	});
	
	it('turns the delay off', function() {
		//lp.delaySwitch(false);
		//expect()... delay to be off
	});
});
