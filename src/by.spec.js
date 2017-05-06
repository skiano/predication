import test from 'tape';
import {by} from './by';

test('Filter by', t => {
  t.plan(9);

  t.equal(by('bar[0]')({bar: [0, 1, 2]}), 0, 'index 0');
  t.equal(by('bar[1]')({bar: [0, 1, 2]}), 1, 'index x');
  t.equal(by('bar[9]')({bar: [0, 1, 2]}), undefined, 'index overflow');

  t.equal(by('bar[-0]')({bar: [0, 1, 2]}), 2, 'reverse index 0');
  t.equal(by('bar[-1]')({bar: [0, 1, 2]}), 1, 'reverse index x');
  t.equal(by('bar[-9]')({bar: [0, 1, 2]}), undefined, 'reverse index overflow');

  t.deepLooseEqual(by()({bar: []}), {bar: []}, 'by undefined');
  t.deepLooseEqual(by()({bar: []}), {bar: []}, 'by empty string');
  
  t.throws(() => {
    by(2)({bar: []});
  }, /bad access path/, 'throw on truthy non-strings');
});