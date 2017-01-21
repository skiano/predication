
import { and, or, not } from './';

const a = x => x % 2 === 0;
const b = x => x % 3 === 0;
const c = x => x > 50;
const d = x => x > 20;

const predicate = and(a, b, or(c, not(d)));

console.log(predicate(60))