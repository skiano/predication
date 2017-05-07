import test from 'tape';
import { getPredicate } from '../predicates';

import '../predicates/operators';
import '../predicates/common';

test('Predicates', t => {
  t.plan(45)

  t.equal(getPredicate('eq', 2)(2), true, 'equals: true');
  t.equal(getPredicate('eq', 2)(3), false, 'equals: false');

  t.equal(getPredicate('ne', 2)(3), true, 'not equals: true');
  t.equal(getPredicate('ne', 2)(2), false, 'not equals: false');

  t.equal(getPredicate('in', [1, 2])(2), true, 'includes: (array) true');
  t.equal(getPredicate('in', [1, 2])(3), false, 'includes: (array) false');

  t.equal(getPredicate('in', 'abc')('bc'), true, 'includes: (string) true');
  t.equal(getPredicate('in', 'aBc')('AbC'), true, 'includes: (string: case insensitive) true');
  t.equal(getPredicate('in', 'abc')('ac'), false, 'includes: (string) false');

  t.equal(getPredicate('nin', [1, 2])(3), true, 'does not include: (array) true');
  t.equal(getPredicate('nin', [1, 2])(2), false, 'does not include: (array) false');

  t.equal(getPredicate('lt', 0)(-1), true, 'less than: less');
  t.equal(getPredicate('lt', 0)(0), false, 'less than: equal');
  t.equal(getPredicate('lt', 0)(1), false, 'less than: more');

  t.equal(getPredicate('gt', 0)(-1), false, 'greater than: less');
  t.equal(getPredicate('gt', 0)(0), false, 'greater than: equal');
  t.equal(getPredicate('gt', 0)(1), true, 'greater than: more');

  t.equal(getPredicate('lte', 0)(-1), true, 'less than or equal: less');
  t.equal(getPredicate('lte', 0)(0), true, 'less than or equal: equal');
  t.equal(getPredicate('lte', 0)(1), false, 'less than or equal: more');

  t.equal(getPredicate('gte', 0)(-1), false, 'greater than or equal: less');
  t.equal(getPredicate('gte', 0)(0), true, 'greater than or equal: equal');
  t.equal(getPredicate('gte', 0)(1), true, 'greater than or equal: more');

  t.equal(getPredicate('rng', [0, 10])(5), true, 'range: within');
  t.equal(getPredicate('rng', [0, 10])(10), true, 'range: max');
  t.equal(getPredicate('rng', [0, 10])(0), true, 'range: min');
  t.equal(getPredicate('rng', [0, 10])(-1), false, 'range: too low');
  t.equal(getPredicate('rng', [0, 10])(11), false, 'range: too high');

  t.equal(getPredicate('mod', 2)(4), true, 'divisible this: true');
  t.equal(getPredicate('mod', 3)(4), false, 'divisible this: false');

  t.equal(getPredicate('mod', [3,0])(3), true, 'divisible this: (remainder) 0');
  t.equal(getPredicate('mod', [3,1])(4), true, 'divisible this: (remainder) 1');
  t.equal(getPredicate('mod', [3,2])(5), true, 'divisible this: (remainder) 2');

  t.equal(getPredicate('oi', 'foo')({a: 'foo', b: 'bar'}), true, 'object includes: top key left');
  t.equal(getPredicate('oi', 'foo')({a: 'bar', b: 'foo'}), true, 'object includes: top key right');
  t.equal(getPredicate('oi', 'foo')({a: {a: 'foo'}, b: {a: 'bar'}}), true, 'object includes: deep key left');
  t.equal(getPredicate('oi', 'foo')({a: {a: 'bar'}, b: {a: 'foo'}}), true, 'object includes: deep key right');
  t.equal(getPredicate('oi', 'foo')({a: ['bar', 'foo']}), true, 'object includes: array');
  t.equal(getPredicate('oi', 'foo')({a: ['bar', {a: 'foo'}]}), true, 'object includes: array with object');
  t.equal(getPredicate('oi', 'foo')('foo'), true, 'object includes: string');
  t.equal(getPredicate('oi', 'foo')(2), false, 'object includes: number');
  t.equal(getPredicate('oi', 'foo')([1, 2, 3]), false, 'object includes: array');
  t.equal(getPredicate('oi', 'foo')(null), false, 'object includes: null');
  t.equal(getPredicate('oi', 'foo')(true), false, 'object includes: boolean');

  t.equal(getPredicate('noi', 'foo')({a: [{a: [1, undefined, false, {a: true, b: 'foo'}]}]}),
    false, 'object doesnt include');
});
