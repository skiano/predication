
import { and, or, not } from './';

const a = x => x % 2 === 0;
const b = x => x % 3 === 0;
const c = x => x > 50;
const d = x => x > 20;

const invertedD = not(d);

const comp = or(c, invertedD);

const predicate = and(a, b, comp);

console.log(predicate(60))