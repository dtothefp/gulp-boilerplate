import {expect} from 'chai';
import moduleA, {dopeness} from '../src/lib/module-a';

describe('es6 karma test', () => {
  var {a, b} = dopeness;

  it('should work', () => {
    expect(moduleA()).to.eq('module-a');
    expect(a).to.eq('a');
    expect(b).to.eq('b');
  });
});
