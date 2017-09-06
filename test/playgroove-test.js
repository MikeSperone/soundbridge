
describe('Playgroove Class', function() {

    let audio = '/audio/arlene.mp3';
    let context = new AudioContext();
    let pg = new Playgroove(audio, context);

    console.log(pg);
    describe('initial values', function() {

        it('starts a new Playgroove class', function() {
            expect(pg).to.exist;
        });

        it('sets the audio', function() {
            expect(pg.audio).to.equal('/audio/arlene.mp3');
        });

        it('fills the audio buffer', function() {
            expect(pg.src.buffer.duration).to.be.within(90,91);
        });

	});
});
