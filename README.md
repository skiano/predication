# predication

### Example

The following code creates a predicate that returns true for numbers less than 15, and not less than 5, and divisible by either 2 or 3.

```javascript
import predication from 'predication';

const data = {$and: [
  {$lt: 15},
  {$not: {$lt: 5}},
  {$or: [
    {$mod: 2},
    {$mod: 3}
  ]}
]}

const predicate = predication(data);

const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const matches = values.filter(predicate);
  
console.log(matches) // [6,8,9,10,12,14]
```
