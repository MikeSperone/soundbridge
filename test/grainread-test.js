
describe('Grainread Class', function() {

	it('should start a new grainread class', function() {

        let audio = '../build/audio/arlene.mp3';
		let context = new AudioContext();
		return new Grainread(audio, context, 1);
	});
});
