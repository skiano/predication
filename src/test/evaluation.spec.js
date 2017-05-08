import test from 'tape';
import { evaluation } from '../';

test('Evaluation', t => {
  t.plan(14);

  t.equal(evaluation('bar[0]')({bar: [0, 1, 2]}), 0, 'index 0');
  t.equal(evaluation('bar[1]')({bar: [0, 1, 2]}), 1, 'index x');
  t.equal(evaluation('bar[9]')({bar: [0, 1, 2]}), undefined, 'index overflow');

  t.equal(evaluation('bar[-0]')({bar: [0, 1, 2]}), 2, 'reverse index 0');
  t.equal(evaluation('bar[-1]')({bar: [0, 1, 2]}), 1, 'reverse index x');
  t.equal(evaluation('bar[-9]')({bar: [0, 1, 2]}), undefined, 'reverse index overflow');

  t.equal(evaluation()(2), 2, 'by undefined');

  const deep = evaluation('foo.bar[3]');

  t.equal(deep(), undefined, 'missing object');
  t.equal(deep({}), undefined, 'missing key');
  t.equal(deep({foo: true}), undefined, 'missing key');
  t.equal(deep({foo: {bar: true}}), undefined, 'missing key');
  t.equal(deep({foo: {bar: {baz: 2}}}), undefined, 'missing key');
  t.equal(deep({foo: {bar: []}}), undefined, 'missing key');

  t.throws(() => {
    evaluation(2)({bar: []});
  }, /bad access path/, 'throw on truthy non-strings');
});
