# and-or-not

### Example

The following code creates a predicate that returns true for numbers less than 15, and not less than 5, and divisible by either 2 or 3.

```javascript

import { and, or, not } from 'and-or-not';
import { $lt, $mod, $mod } from 'and-or-not';

const predicate = and($lt(15), 
                      not($lt(5)),
                      or($mod(2), $mod(3)));

const bool = predicate(15);

```
