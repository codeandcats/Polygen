import { expect } from 'chai';
import { moveElement } from '../../../../src/shared/utils/arrays';

describe('moveElement', () => {

	it('should move an element backwards', () => {
		const original = ['a', 'b', 'c', 'd', 'e'];
		const actual = moveElement(original, 3, 2);
		const expected = ['a', 'c', 'b', 'd', 'e'];
		expect(actual).to.deep.equal(expected);
	});

	it('should move an element forwards', () => {
		const original = ['a', 'b', 'c', 'd', 'e'];
		const actual = moveElement(original, 3, 4);
		const expected = ['a', 'b', 'd', 'c', 'e'];
		expect(actual).to.deep.equal(expected);
	});

	it('should not move an element', () => {
		const original = ['a', 'b', 'c', 'd', 'e'];
		const actual = moveElement(original, 3, 4);
		const expected = ['a', 'b', 'c', 'd', 'e'];
		expect(actual).to.deep.equal(expected);
	});

	it('should not modify the original array', () => {
		const original = ['a', 'b', 'c', 'd', 'e'];
		const copyOfOriginalReference = original;
		const copyOfOriginal = [...original];

		const actual = moveElement(original, 3, 4);

		expect(original).to.equal(copyOfOriginalReference);
		expect(original).to.deep.equal(copyOfOriginal);
	});

});
