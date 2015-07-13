import {expect} from 'chai';

describe('es6 test', () => {
  let obj = {one: 1, two: 2};

  it('should work', () => {
    var {one, two} = obj;
    expect(one).to.eql(1);
    expect(two).to.eql(2);
  });
});
