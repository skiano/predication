# and-or-not

### Example

The following code creates a predicate that returns true for numbers less than 15, and not less than 5, and divisible by either 2 or 3.

```javascript
import { and, or, not } from 'and-or-not';
import { $lt, $mod } from 'and-or-not';

const predicate = and($lt(15), 
                      not($lt(5)),
                      or($mod(2), $mod(3)));

  const oneToTwenty = [1,2,3,4,5,6,7,8,
    9,10,11,12,13,14,15,16,17,18,19,20];

  const matches = oneToTwenty.filter(predicate);
  
  console.log(matches) // [6,8,9,10,12,14]
```
