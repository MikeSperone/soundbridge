import 'chai';
import 'web-audio-test-api';
import { setSettings } from '../src/js/soundbridge.js';

import * as json from '../src/js/settings.js';

describe('Play Class', function() {
	
	describe("setSettings()", function() {

		it('should soundbridge', function() {
			return true;
		});

		it('should return the correct settings', function() {

			const settings = setSettings(json.settings, 0);
			settings.should.deep.equal({ samples: {"0": "water3", "1": "drillingbursts",  "2": "crickets", "3":"arleneNR", "a":""},
															grain: [28, 1, 2, 0.2],
															delay: [false, true, [], false]
														});
		});
	});

});

