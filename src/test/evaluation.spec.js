import test from 'tape';
import { evaluation } from '../';

test('Evaluation', t => {
  t.plan(10);

  t.equal(evaluation('bar[0]')({bar: [0, 1, 2]}), 0, 'index 0');
  t.equal(evaluation('bar[1]')({bar: [0, 1, 2]}), 1, 'index x');
  t.equal(evaluation('bar[9]')({bar: [0, 1, 2]}), undefined, 'index overflow');

  t.equal(evaluation('bar[-0]')({bar: [0, 1, 2]}), 2, 'reverse index 0');
  t.equal(evaluation('bar[-1]')({bar: [0, 1, 2]}), 1, 'reverse index x');
  t.equal(evaluation('bar[-9]')({bar: [0, 1, 2]}), undefined, 'reverse index overflow');

  t.equal(evaluation()(2), 2, 'by undefined');
  t.equal(evaluation('missing')({}), undefined, 'missing key');
  t.equal(evaluation('missing')(), undefined, 'missing value');

  t.throws(() => {
    evaluation(2)({bar: []});
  }, /bad access path/, 'throw on truthy non-strings');
});
