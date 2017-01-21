import test from 'tape';
import { and, or, not } from './';
import { $lt, $mod } from './';

test('Logic', t => {
  t.plan(1);

  const predicate = and($lt(15), 
                        not($lt(5)),
                        or($mod(2), $mod(3)));

  const values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
  const matches = values.filter(predicate);

  t.deepLooseEqual(matches,
    [ 6, 8, 9, 10, 12, 14 ],
    'filter: less than 15, and not less than 5, and divisible by either 2 or 3')
});