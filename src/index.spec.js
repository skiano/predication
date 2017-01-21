import test from 'tape';
import { and, or, not } from './';
import { $lt, $mod } from './';

test('Composition', t => {
  t.plan(1);

  const predicate = and($lt(15), 
                      not($lt(5)),
                      or($mod(2), $mod(3)));

  const oneToFifteen = Array.from(Array(20).keys());
  const matches = oneToFifteen.filter(predicate);

  t.deepLooseEqual(matches,
    [ 6, 8, 9, 10, 12, 14 ],
    'filter: less than 15, and not less than 5, and divisible by either 2 or 3')
});