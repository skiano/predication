# and-or-not

#### Example

The following code creates a predicate that returns true for numbers _less than 15, and not less than 5, and divisible by either 2 or 3_.

```javascript

import aon from 'and-not-or';

const data = ['&&', ['lessThan', 'v', 15],
                    ['!', ['lessThan', 'v', 5]],
                    ['||', ['divisibleBy', 'v', 2],
                           ['divisibleBy', 'v', 3]]];

const interpreter = {
  lessThan: (model, key, threshold) => {
    return model[key] < threshold;
  },
  divisibleBy: (model, key, modulus) => {
    return model[key] % modulus === 0;
  }
}

const predicate = aon(data, interpreter);

const oneToFifteen = Array.from(Array(15).keys()).map(v => ({v: v + 1}));

const matches = oneToFifteen.filter(predicate);

// matches = [ { v: 6 }, { v: 8 }, { v: 9 }, { v: 10 }, { v: 12 }, { v: 14 } ]
console.log(matches);

```
