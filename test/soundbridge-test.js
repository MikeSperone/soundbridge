
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

