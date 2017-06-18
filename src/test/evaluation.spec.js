import test from 'tape';
import { evaluation } from '../';

test('Evaluation', t => {
  t.plan(22);

  t.equal(evaluation('bar[0]')({bar: [0, 1, 2]}), 0, 'index 0');
  t.equal(evaluation('bar[1]')({bar: [0, 1, 2]}), 1, 'index x');
  t.equal(evaluation('bar[9]')({bar: [0, 1, 2]}), undefined, 'index overflow');

  t.equal(evaluation('bar[-0]')({bar: [0, 1, 2]}), 2, 'reverse index 0');
  t.equal(evaluation('bar[-1]')({bar: [0, 1, 2]}), 1, 'reverse index x');
  t.equal(evaluation('bar[-9]')({bar: [0, 1, 2]}), undefined, 'reverse index overflow');

  t.equal(evaluation('length')('abc'), 3, 'access string length');
  t.equal(evaluation('foo.length')({foo: 'abc'}), 3, 'access string length deep');
  t.equal(evaluation('length')([0, 1, 2]), 3, 'access array length');
  t.equal(evaluation('bar.length')({bar: [0, 1, 2]}), 3, 'access array length deep');

  t.equal(evaluation('[1]')([0, 3, 2]), 3, 'index x from array');
  t.equal(evaluation('[-0]')([0, 3, 2]), 2, 'index x from array reversed');

  t.equal(evaluation('[0]')('boy'), 'b', 'index x from string');
  t.equal(evaluation('[-1]')('boy'), 'o', 'index x from string reversed');

  t.equal(evaluation()(2), 2, 'by undefined');

  const deep = evaluation('foo.bar[3]');

  t.equal(deep(), undefined, 'missing object');
  t.equal(deep({}), undefined, 'missing key: level 1');
  t.equal(deep({foo: true}), undefined, 'missing key: level 2');
  t.equal(deep({foo: {bar: true}}), undefined, 'missing key: bool');
  t.equal(deep({foo: {bar: {baz: 2}}}), undefined, 'missing key: num');
  t.equal(deep({foo: {bar: []}}), undefined, 'missing array value');

  t.throws(() => {
    evaluation(2)({bar: []});
  }, /bad access path/, 'throw on truthy non-strings');
});
