import test from 'tape';
import predicates, { missing } from '../predicates';

test('Predicates', t => {
  t.plan(58)

  t.equal(predicates.eq(2)(2), true, 'equals: true');
  t.equal(predicates.eq(2)(3), false, 'equals: false');
  t.equal(predicates.eq(2)(undefined), missing, 'equals: undefined');

  t.equal(predicates.ne(2)(3), true, 'not equals: true');
  t.equal(predicates.ne(2)(2), false, 'not equals: false');
  t.equal(predicates.ne(2)(undefined), missing, 'not equals: undefined');

  t.equal(predicates.in([1, 2])(2), true, 'includes: (array) true');
  t.equal(predicates.in([1, 2])(3), false, 'includes: (array) false');
  t.equal(predicates.in([1, 2])(undefined), missing, 'includes: (array) undefined');

  t.equal(predicates.in('abc')('bc'), true, 'includes: (string) true');
  t.equal(predicates.in('aBc')('AbC'), true, 'includes: (string: case insensitive) true');
  t.equal(predicates.in('abc')('ac'), false, 'includes: (string) false');
  t.equal(predicates.in('abc')(undefined), missing, 'includes: (string) undefined');

  t.equal(predicates.nin([1, 2])(3), true, 'does not include: (array) true');
  t.equal(predicates.nin([1, 2])(2), false, 'does not include: (array) false');
  t.equal(predicates.nin([1, 2])(undefined), missing, 'does not include: (array) undefined');

  t.equal(predicates.lt(0)(-1), true, 'less than: less');
  t.equal(predicates.lt(0)(0), false, 'less than: equal');
  t.equal(predicates.lt(0)(1), false, 'less than: more');
  t.equal(predicates.lt(10)(undefined), missing, 'less than: undefined');

  t.equal(predicates.gt(0)(-1), false, 'greater than: less');
  t.equal(predicates.gt(0)(0), false, 'greater than: equal');
  t.equal(predicates.gt(0)(1), true, 'greater than: more');
  t.equal(predicates.gt(10)(undefined), missing, 'greater than: undefined');

  t.equal(predicates.lte(0)(-1), true, 'less than or equal: less');
  t.equal(predicates.lte(0)(0), true, 'less than or equal: equal');
  t.equal(predicates.lte(0)(1), false, 'less than or equal: more');
  t.equal(predicates.lte(10)(undefined), missing, 'less than or equal: undefined');

  t.equal(predicates.gte(0)(-1), false, 'greater than or equal: less');
  t.equal(predicates.gte(0)(0), true, 'greater than or equal: equal');
  t.equal(predicates.gte(0)(1), true, 'greater than or equal: more');
  t.equal(predicates.gte(10)(undefined), missing, 'greater than or equal: undefined');

  t.equal(predicates.rng([0, 10])(5), true, 'range: within');
  t.equal(predicates.rng([0, 10])(10), true, 'range: max');
  t.equal(predicates.rng([0, 10])(0), true, 'range: min');
  t.equal(predicates.rng([0, 10])(-1), false, 'range: too low');
  t.equal(predicates.rng([0, 10])(11), false, 'range: too high');
  t.equal(predicates.rng([0, 10])(undefined), missing, 'range: undefined');

  t.equal(predicates.mod(2)(4), true, 'divisible by: true');
  t.equal(predicates.mod(3)(4), false, 'divisible by: false');
  t.equal(predicates.mod(2)(undefined), missing, 'mod: undefined');

  t.equal(predicates.mod([3,0])(3), true, 'divisible by: (remainder) 0');
  t.equal(predicates.mod([3,1])(4), true, 'divisible by: (remainder) 1');
  t.equal(predicates.mod([3,2])(5), true, 'divisible by: (remainder) 2');
  t.equal(predicates.mod([3,2])(undefined), missing, 'divisible by: (remainder) undefined');

  t.equal(predicates.oi('foo')({a: 'foo', b: 'bar'}), true, 'object includes: top key left');
  t.equal(predicates.oi('foo')({a: 'bar', b: 'foo'}), true, 'object includes: top key right');
  t.equal(predicates.oi('foo')({a: {a: 'foo'}, b: {a: 'bar'}}), true, 'object includes: deep key left');
  t.equal(predicates.oi('foo')({a: {a: 'bar'}, b: {a: 'foo'}}), true, 'object includes: deep key right');
  t.equal(predicates.oi('foo')({a: ['bar', 'foo']}), true, 'object includes: array');
  t.equal(predicates.oi('foo')({a: ['bar', {a: 'foo'}]}), true, 'object includes: array with object');
  t.equal(predicates.oi('foo')('foo'), true, 'object includes: string');
  t.equal(predicates.oi('foo')(2), false, 'object includes: number');
  t.equal(predicates.oi('foo')([1, 2, 3]), false, 'object includes: array');
  t.equal(predicates.oi('foo')(null), false, 'object includes: null');
  t.equal(predicates.oi('foo')(true), false, 'object includes: boolean');
  t.equal(predicates.oi('foo')(undefined), missing, 'object includes: undefined');

  t.equal(predicates.noi('foo')({a: [{a: [1, undefined, false, {a: true, b: 'foo'}]}]}),
    false, 'object doesnt include');
});



