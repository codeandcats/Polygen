import { moveElement } from './arrays';

describe('moveElement', () => {

  it('should move an element backwards', () => {
    const original = ['a', 'b', 'c', 'd', 'e'];
    const actual = moveElement(original, 3, 2);
    const expected = ['a', 'b', 'd', 'c', 'e'];
    expect(actual).toEqual(expected);
  });

  it('should move an element forwards', () => {
    const original = ['a', 'b', 'c', 'd', 'e'];
    const actual = moveElement(original, 3, 4);
    const expected = ['a', 'b', 'c', 'e', 'd'];
    expect(actual).toEqual(expected);
  });

  it('should not modify the original array', () => {
    const original = ['a', 'b', 'c', 'd', 'e'];
    const copyOfOriginalReference = original;
    const copyOfOriginal = [...original];

    moveElement(original, 3, 4);

    expect(original).toBe(copyOfOriginalReference);
    expect(original).toEqual(copyOfOriginal);
  });

});
