# and-or-not

#### Example

The following code creates a predicate that returns true for numbers _less than 15, and not less than 5, and divisible by either 2 or 3_.

```javascript

import aon from 'and-or-not';

const data = ['&&', ['lessThan', 'v', 15],
                      ['!', ['lessThan', 'v', 5]],
                      ['||', ['divisibleBy', 'v', 2],
                             ['divisibleBy', 'v', 3]]];

const predicate = aon(data, interpreter);

predicate(({v: 6}); // true
predicate(({v: 8}); // true
predicate(({v: 9}); // true
predicate(({v: 7}); // false
predicate(({v: 3}); // false
predicate(({v: 17}); // false

```
