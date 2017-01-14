
import { and, or, not, createAndOrNot } from './';

const a = x => x % 2 === 0;
const b = x => x % 3 === 0;
const c = x => x % 4 === 0;
const d = x => x > 20;

const check = and(a, or(b, c), not(d));

let i = 0;
while (i < 50) {
  if (check(i)) console.log(i);
  i += 1;
}

