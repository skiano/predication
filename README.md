# and-or-not

#### example

The following prints numbers that are divisible by 2, and divisible by either 3 or 4, and not less than 20.

```javascript

import { and, or, not } from './';

// individual predicates

const isEven = x => x % 2 === 0;
const isTriple = x => x % 3 === 0;
const isQuadrupal = x => x % 4 === 0;
const isLessThanTwenty = x => x < 20;

// combine predicates with logic
// they can nest however you want

const predicate = and(isEven,
                      not(isLessThanTwenty),
                      or(isTriple, 
                         isQuadrupal));

let i = 0;
while (i < 50) {
  if (predicate(i)) console.log(i);
  i += 1;
}

```
