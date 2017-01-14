
import { and, or, not, createAndOrNot } from './';

const a = x => x % 2 === 0;
const b = x => x % 3 === 0;
const c = x => x > 20;

const check = and(a, b, c);
const check2 = or(a, b, c);

console.log(check2(7));