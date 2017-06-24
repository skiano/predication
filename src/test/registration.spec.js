import test from 'tape';
import {
  registerPredicate,
  removePredicate,
  listPredicates,
  hasPredicate,
  getPredicate
} from '../';

test('Registry of predicates', t => {
  t.plan(5);

  t.true(Array.isArray(listPredicates()), 'list predicates');

  registerPredicate('foo', c => v => true);

  t.true(typeof getPredicate('foo') === 'function', 'register and get prdicate');

  t.true(hasPredicate('foo'), 'check for predicate');

  removePredicate('foo');

  t.throws(() => getPredicate('foo'), /Unregisterd predicate: "foo"/, 'remove and check');

  t.throws(() => registerPredicate('and', c => v => false,
    /Predicate "and" is already registered/, 'prevent overriting'))
});

test('Predicates THIS', t => {
  t.plan(10);

  t.true(getPredicate('eq', 2, 'foo')({foo: 2}), 'simple this');
  t.true(getPredicate('eq', 2, 'foo.bar[0]')({foo: {bar: [2]}}), 'advanced this');
  t.equal(getPredicate('eq', 2, 'foo.baz')({foo: {bar: [2]}}), undefined, 'bad this');
  t.equal(getPredicate('eq', 2, 'foo.baz')(), undefined, 'bad value');

  const eq = getPredicate('eq', true, 'bar');
  const gt = getPredicate('eq', true, 'baz');
  const both = getPredicate('and', [eq, gt], 'foo');
  const either = getPredicate('or', [eq, gt], 'foo');

  t.true(both({foo: {bar: true, baz: true}}), 'combination - and: true');
  t.false(both({foo: {bar: false, baz: true}}), 'combination - and: false');
  t.false(both({foo: {bar: true}}), 'combination - and: undefined');

  t.true(either({foo: {bar: false, baz: true}}), 'combination - or: true');
  t.false(either({foo: {bar: false, baz: false}}), 'combination - or: false');
  t.true(either({foo: {baz: true}}), 'combination - or: undefined');
});

test('Predicates THAT', t => {
  t.plan(4);

  t.true(getPredicate('eq', {that: 'bar'}, 'foo')({foo: 2, bar: 2}), 'simple that');
  t.true(getPredicate('eq', {that: 'bar[0]'}, 'foo')({foo: 2, bar: [2]}), 'advanced that');
  t.equal(getPredicate('eq', {that: 'bar[0].baz'}, 'foo')({foo: 2, bar: [2]}), undefined, 'bad that');
  t.equal(getPredicate('eq', {that: 'bar[0].baz'}, 'foo')(), undefined, 'bad value');
});

test('Predicates NOT with undefined', t => {
  t.plan(4);

  const EQ = getPredicate('eq', 2, 'foo.baz');
  const notEQ = getPredicate('not', EQ);

  t.true(EQ({foo: {baz: 2}}), 'equal');
  t.false(notEQ({foo: {baz: 2}}), 'not equal');
  t.true(notEQ({foo: {baz: 4}}), 'not not equal');
  t.false(notEQ({bar: true}), 'not not equal');
});

test('Predicates', t => {
  t.plan(62)

  t.true(getPredicate('exists', true)(0), 'exists: true for 0');
  t.true(getPredicate('exists', true)(''), 'exists: true for empty string');
  t.true(getPredicate('exists', true)(false), 'exists: true for false');
  t.true(getPredicate('exists', true)(null), 'exists: true for null');
  t.false(getPredicate('exists', true)(undefined), 'exists: false for undefined');

  t.true(getPredicate('not', () => false)(1), 'not: true');
  t.false(getPredicate('not', () => true)(1), 'not: true');

  t.true(getPredicate('or', [() => true, () => false])(1), 'or: true early');
  t.true(getPredicate('or', [() => false, () => true])(1), 'or: true late');
  t.false(getPredicate('or', [() => false, () => false])(1), 'or: false');

  t.false(getPredicate('and', [() => false, () => true])(1), 'and: false early');
  t.false(getPredicate('and', [() => true, () => false])(1), 'and: false late');
  t.true(getPredicate('and', [() => true, () => true])(1), 'and: true');
  t.false(getPredicate('and', [() => true, () => undefined])(1), 'and: handle undefined');

  t.true(getPredicate('eq', 2)(2), 'equals: true');
  t.false(getPredicate('eq', 2)(3), 'equals: false');

  t.true(getPredicate('ne', 2)(3), 'not equals: true');
  t.false(getPredicate('ne', 2)(2), 'not equals: false');

  t.true(getPredicate('in', 2)([1, 2]), 'includes: (array) true');
  t.false(getPredicate('in', 3)([1, 2]), 'includes: (array) false');

  t.true(getPredicate('in', 'bc')('abc'), 'includes: (string) true');
  t.true(getPredicate('in', 'AbC')('aBc'), 'includes: (string: case insensitive) true');
  t.false(getPredicate('in', 'ac')('abc'), 'includes: (string) false');
  t.false(getPredicate('in', 'ac')(false), 'includes: (missing value) false');

  t.true(getPredicate('nin', 3)([1, 2]), 'does not include: (array) true');
  t.false(getPredicate('nin', 2)([1, 2]), 'does not include: (array) false');

  t.true(getPredicate('lt', 0)(-1), 'less than: less');
  t.false(getPredicate('lt', 0)(0), 'less than: equal');
  t.false(getPredicate('lt', 0)(1), 'less than: more');

  t.false(getPredicate('gt', 0)(-1), 'greater than: less');
  t.false(getPredicate('gt', 0)(0), 'greater than: equal');
  t.true(getPredicate('gt', 0)(1), 'greater than: more');

  t.true(getPredicate('lte', 0)(-1), 'less than or equal: less');
  t.true(getPredicate('lte', 0)(0), 'less than or equal: equal');
  t.false(getPredicate('lte', 0)(1), 'less than or equal: more');

  t.false(getPredicate('gte', 0)(-1), 'greater than or equal: less');
  t.true(getPredicate('gte', 0)(0), 'greater than or equal: equal');
  t.true(getPredicate('gte', 0)(1), 'greater than or equal: more');

  t.true(getPredicate('rng', [0, 10])(5), 'range: within');
  t.true(getPredicate('rng', [0, 10])(10), 'range: max');
  t.true(getPredicate('rng', [0, 10])(0), 'range: min');
  t.false(getPredicate('rng', [0, 10])(-1), 'range: too low');
  t.false(getPredicate('rng', [0, 10])(11), 'range: too high');

  t.true(getPredicate('mod', 2)(4), 'divisible this: true');
  t.false(getPredicate('mod', 3)(4), 'divisible this: false');

  t.true(getPredicate('mod', [3,0])(3), 'divisible this: (remainder) 0');
  t.true(getPredicate('mod', [3,1])(4), 'divisible this: (remainder) 1');
  t.true(getPredicate('mod', [3,2])(5), 'divisible this: (remainder) 2');
  t.true(getPredicate('mod', [3,4])(4), 'divisible this: (remainder) overflow');

  t.true(getPredicate('oi', 'foo')({a: 'foo', b: 'bar'}), 'object includes: top key left');
  t.true(getPredicate('oi', 'foo')({a: 'bar', b: 'foo'}), 'object includes: top key right');
  t.true(getPredicate('oi', 'foo')({a: {a: 'foo'}, b: {a: 'bar'}}), 'object includes: deep key left');
  t.true(getPredicate('oi', 'foo')({a: {a: 'bar'}, b: {a: 'foo'}}), 'object includes: deep key right');
  t.true(getPredicate('oi', 'foo')({a: ['bar', 'foo']}), 'object includes: array');
  t.true(getPredicate('oi', 'foo')({a: ['bar', {a: 'foo'}]}), 'object includes: array with object');
  t.true(getPredicate('oi', 'foo')('foo'), 'object includes: string');
  t.false(getPredicate('oi', 'foo')(2), 'object includes: number');
  t.false(getPredicate('oi', 'foo')([1, 2, 3]), 'object includes: array');
  t.false(getPredicate('oi', 'foo')(null), 'object includes: null');
  t.false(getPredicate('oi', 'foo')(true), 'object includes: boolean');
  t.true(getPredicate('oi', 'fo')({a: 'ooofoo', b: 'bar'}), 'object includes partial string: top key left');
  t.false(getPredicate('noi', 'foo')(
    {a: [{a: [1, undefined, false, {a: true, b: 'foo'}]}]}
  ), 'object doesnt include');
});
