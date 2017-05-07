import test from 'tape';
import predicates, { missing } from './predicates';

test('Predicates', t => {
  t.plan(16);

  t.equal(predicates.eq(2)(2), true, 'equals: true');
  t.equal(predicates.eq(2)(3), false, 'equals: false');
  t.equal(predicates.eq(2)(undefined), missing, 'equals: undefined');

  t.equal(predicates.ne(2)(3), true, 'not equals: true');
  t.equal(predicates.ne(2)(2), false, 'not equals: false');
  t.equal(predicates.ne(2)(undefined), missing, 'not equals: undefined');

  t.equal(predicates.in([1, 2])(2), true, 'in: (array) true');
  t.equal(predicates.in([1, 2])(3), false, 'in: (array) false');
  t.equal(predicates.in([1, 2])(undefined), missing, 'in: (array) undefined');

  t.equal(predicates.in('abc')('bc'), true, 'in: (string) true');
  t.equal(predicates.in('aBc')('AbC'), true, 'in: (string: case insensitive) true');
  t.equal(predicates.in('abc')('ac'), false, 'in: (string) false');
  t.equal(predicates.in('abc')(undefined), missing, 'in: (string) undefined');

  t.equal(predicates.nin([1, 2])(3), true, 'nin: (array) true');
  t.equal(predicates.nin([1, 2])(2), false, 'nin: (array) false');
  t.equal(predicates.nin([1, 2])(undefined), missing, 'nin: (array) undefined');
});



