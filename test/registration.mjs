import assert from 'assert';
import {
  registerPredicate,
  removePredicate,
  listPredicates,
  hasPredicate,
  getPredicate
} from '../src/index.mjs';

export default [
  {
    name: 'registry of predicates',
    execute() {
      assert(Array.isArray(listPredicates()), 'list predicates');

      registerPredicate('foo', c => v => true);

      assert(typeof getPredicate('foo') === 'function', 'register and get prdicate');

      assert(hasPredicate('foo'), 'check for predicate');

      removePredicate('foo');

      assert.throws(() => getPredicate('foo'), /Unregisterd predicate: "foo"/, 'remove and check');

      assert.throws(() => registerPredicate('and', c => v => false,
        /Predicate "and" is already registered/, 'prevent overriting'))
    },
  },
  {
    name: 'predicates THIS',
    execute() {
      assert(getPredicate('eq', 2, 'foo')({foo: 2}), 'simple this');
      assert(getPredicate('eq', 2, 'foo.bar[0]')({foo: {bar: [2]}}), 'advanced this');
      assert.equal(getPredicate('eq', 2, 'foo.baz')({foo: {bar: [2]}}), undefined, 'bad this');
      assert.equal(getPredicate('eq', 2, 'foo.baz')(), undefined, 'bad value');

      const eq = getPredicate('eq', true, 'bar');
      const gt = getPredicate('eq', true, 'baz');
      const both = getPredicate('and', [eq, gt], 'foo');
      const either = getPredicate('or', [eq, gt], 'foo');

      assert(both({foo: {bar: true, baz: true}}), 'combination - and: true');
      assert(!both({foo: {bar: false, baz: true}}), 'combination - and: false');
      assert(!both({foo: {bar: true}}), 'combination - and: undefined');

      assert(either({foo: {bar: false, baz: true}}), 'combination - or: true');
      assert(!either({foo: {bar: false, baz: false}}), 'combination - or: false');
      assert(either({foo: {baz: true}}), 'combination - or: undefined');
    }
  },
  {
    name: 'predicates THAT',
    execute() {
      assert(getPredicate('eq', {that: 'bar'}, 'foo')({foo: 2, bar: 2}), 'simple that');
      assert(getPredicate('eq', {that: 'bar[0]'}, 'foo')({foo: 2, bar: [2]}), 'advanced that');
      assert.equal(getPredicate('eq', {that: 'bar[0].baz'}, 'foo')({foo: 2, bar: [2]}), undefined, 'bad that');
      assert.equal(getPredicate('eq', {that: 'bar[0].baz'}, 'foo')(), undefined, 'bad value');
    }
  },
  {
    name: 'predicates NOT with undefined',
    execute() {
      const EQ = getPredicate('eq', 2, 'foo.baz');
      const notEQ = getPredicate('not', EQ);

      assert(EQ({foo: {baz: 2}}), 'equal');
      assert(!notEQ({foo: {baz: 2}}), 'not equal');
      assert(notEQ({foo: {baz: 4}}), 'not not equal');
      assert(!notEQ({bar: true}), 'not not equal');
    }
  },
  {
    name: 'default predicates',
    execute() {
      assert(getPredicate('exists', true)(0), 'exists: true for 0');
      assert(getPredicate('exists', true)(''), 'exists: true for empty string');
      assert(getPredicate('exists', true)(false), 'exists: true for false');
      assert(getPredicate('exists', true)(null), 'exists: true for null');
      assert(!getPredicate('exists', true)(undefined), 'exists: false for undefined');

      assert(getPredicate('not', () => false)(1), 'not: true');
      assert(!getPredicate('not', () => true)(1), 'not: true');

      assert(getPredicate('or', [() => true, () => false])(1), 'or: true early');
      assert(getPredicate('or', [() => false, () => true])(1), 'or: true late');
      assert(!getPredicate('or', [() => false, () => false])(1), 'or: false');

      assert(!getPredicate('and', [() => false, () => true])(1), 'and: false early');
      assert(!getPredicate('and', [() => true, () => false])(1), 'and: false late');
      assert(getPredicate('and', [() => true, () => true])(1), 'and: true');
      assert(!getPredicate('and', [() => true, () => undefined])(1), 'and: handle undefined');

      assert(getPredicate('eq', 2)(2), 'equals: true');
      assert(!getPredicate('eq', 2)(3), 'equals: false');

      assert(getPredicate('ne', 2)(3), 'not equals: true');
      assert(!getPredicate('ne', 2)(2), 'not equals: false');

      assert(getPredicate('in', 2)([1, 2]), 'includes: (array) true');
      assert(!getPredicate('in', 3)([1, 2]), 'includes: (array) false');

      assert(getPredicate('in', 'bc')('abc'), 'includes: (string) true');
      assert(getPredicate('in', 'AbC')('aBc'), 'includes: (string: case insensitive) true');
      assert(!getPredicate('in', 'ac')('abc'), 'includes: (string) false');
      assert(!getPredicate('in', 'ac')(false), 'includes: (missing value) false');

      assert(getPredicate('nin', 3)([1, 2]), 'does not include: (array) true');
      assert(!getPredicate('nin', 2)([1, 2]), 'does not include: (array) false');

      assert(getPredicate('lt', 0)(-1), 'less than: less');
      assert(!getPredicate('lt', 0)(0), 'less than: equal');
      assert(!getPredicate('lt', 0)(1), 'less than: more');

      assert(!getPredicate('gt', 0)(-1), 'greater than: less');
      assert(!getPredicate('gt', 0)(0), 'greater than: equal');
      assert(getPredicate('gt', 0)(1), 'greater than: more');

      assert(getPredicate('lte', 0)(-1), 'less than or equal: less');
      assert(getPredicate('lte', 0)(0), 'less than or equal: equal');
      assert(!getPredicate('lte', 0)(1), 'less than or equal: more');

      assert(!getPredicate('gte', 0)(-1), 'greater than or equal: less');
      assert(getPredicate('gte', 0)(0), 'greater than or equal: equal');
      assert(getPredicate('gte', 0)(1), 'greater than or equal: more');

      assert(getPredicate('rng', [0, 10])(5), 'range: within');
      assert(getPredicate('rng', [0, 10])(10), 'range: max');
      assert(getPredicate('rng', [0, 10])(0), 'range: min');
      assert(!getPredicate('rng', [0, 10])(-1), 'range: too low');
      assert(!getPredicate('rng', [0, 10])(11), 'range: too high');

      assert(getPredicate('mod', 2)(4), 'divisible this: true');
      assert(!getPredicate('mod', 3)(4), 'divisible this: false');

      assert(getPredicate('mod', [3,0])(3), 'divisible this: (remainder) 0');
      assert(getPredicate('mod', [3,1])(4), 'divisible this: (remainder) 1');
      assert(getPredicate('mod', [3,2])(5), 'divisible this: (remainder) 2');
      assert(getPredicate('mod', [3,4])(4), 'divisible this: (remainder) overflow');

      assert(getPredicate('oi', 'foo')({a: 'foo', b: 'bar'}), 'object includes: top key left');
      assert(getPredicate('oi', 'foo')({a: 'bar', b: 'foo'}), 'object includes: top key right');
      assert(getPredicate('oi', 'foo')({a: {a: 'foo'}, b: {a: 'bar'}}), 'object includes: deep key left');
      assert(getPredicate('oi', 'foo')({a: {a: 'bar'}, b: {a: 'foo'}}), 'object includes: deep key right');
      assert(getPredicate('oi', 'foo')({a: ['bar', 'foo']}), 'object includes: array');
      assert(getPredicate('oi', 'foo')({a: ['bar', {a: 'foo'}]}), 'object includes: array with object');
      assert(getPredicate('oi', 'foo')('foo'), 'object includes: string');
      assert(!getPredicate('oi', 'foo')(2), 'object includes: number');
      assert(!getPredicate('oi', 'foo')([1, 2, 3]), 'object includes: array');
      assert(!getPredicate('oi', 'foo')(null), 'object includes: null');
      assert(!getPredicate('oi', 'foo')(true), 'object includes: boolean');
      assert(getPredicate('oi', 'fo')({a: 'ooofoo', b: 'bar'}), 'object includes partial string: top key left');
      assert(!getPredicate('noi', 'foo')(
        {a: [{a: [1, undefined, false, {a: true, b: 'foo'}]}]}
      ), 'object doesnt include');
    }
  }
];