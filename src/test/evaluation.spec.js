import test from 'tape';
import { evaluation } from '../';

test('Evaluation', t => {
  t.plan(9);

  t.equal(evaluation('bar[0]')({bar: [0, 1, 2]}), 0, 'index 0');
  t.equal(evaluation('bar[1]')({bar: [0, 1, 2]}), 1, 'index x');
  t.equal(evaluation('bar[9]')({bar: [0, 1, 2]}), undefined, 'index overflow');

  t.equal(evaluation('bar[-0]')({bar: [0, 1, 2]}), 2, 'reverse index 0');
  t.equal(evaluation('bar[-1]')({bar: [0, 1, 2]}), 1, 'reverse index x');
  t.equal(evaluation('bar[-9]')({bar: [0, 1, 2]}), undefined, 'reverse index overflow');

  t.deepLooseEqual(evaluation()({bar: []}), {bar: []}, 'by undefined');
  t.deepLooseEqual(evaluation()({bar: []}), {bar: []}, 'by empty string');
  
  t.throws(() => {
    evaluation(2)({bar: []});
  }, /bad access path/, 'throw on truthy non-strings');
});
