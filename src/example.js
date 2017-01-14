
import { and, or, not, createAndOrNot } from './';

const a = x => x % 2 === 0;
const b = x => x % 3 === 0;
const c = x => x > 20;

const check1 = and(a, b, c);
const check2 = or(a, b, c);

console.log("AND");

console.log(check1(24)); // true
console.log(check1(6));  // false

console.log("OR");

console.log(check2(8));  // true
console.log(check2(7));  // false