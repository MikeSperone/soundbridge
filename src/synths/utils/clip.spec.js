import clip from './clip';

export default() => (
    describe('utility functions', function() {

        describe('clip', () => {

            it('clips the value between the default min (0) and max (1)', function() {
                expect(clip(1.0001)).to.equal(1);
                expect(clip(-0.4)).to.equal(0);
            });

            it('clips the value between passed min/max values', function() {
                expect(clip(12.0001, { max: 12 })).to.equal(12);
                expect(clip(-4, { min: -1 })).to.equal(-1);
                expect(clip(14.03, { min: 1, max: 15 })).to.equal(14.03);
            });
        })

    })
);
