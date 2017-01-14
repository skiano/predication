# and-or-not

```javascript

import {and, or, not, toData, fromData} from 'and-or-not';

const a = x => x > 100;
const b = x => x % 2 === 0;
const c = x => x % 3 === 0;
const d = x => x % 4 === 0;
const e = x => x % 5 === 0;
const f = x => x < 100 * 100;

const check = and(a, f, or(c, d, e, not(b)));

check(1000); // returns bool

const dataVersion = toData(check);
const fnVersion = fromData(dataVersion)

```
