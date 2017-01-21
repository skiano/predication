import test from 'tape';

test('Composition', t => {
  t.plan(1);

  const interpreter = {
    lessThan: (model, key, threshold) => {
      return model[key] < threshold;
    },
    divisibleBy: (model, key, modulus) => {
      return model[key] % modulus === 0;
    }
  }

  const data = ['&&', ['lessThan', 'v', 15],
                      ['!', ['lessThan', 'v', 5]],
                      ['||', ['divisibleBy', 'v', 2],
                             ['divisibleBy', 'v', 3]]];

  const predicate = aon(data, interpreter);
  const oneToFifteen = Array.from(Array(20).keys()).map(v => ({v: v + 1}));
  const matches = oneToFifteen.filter(predicate);

  t.deepLooseEqual(matches,
    [ { v: 6 }, { v: 8 }, { v: 9 }, { v: 10 }, { v: 12 }, { v: 14 } ],
    'filter: less than 15, and not less than 5, and divisible by either 2 or 3')
});