
describe('Loop Class', function() {

	it('should start a new instance', function() {
		let audio = '/audio/arlene.mp3';
		let context = new AudioContext();
		return new Loop(audio, context);
	});
});
