
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

// The range of numbers from 1 to 50

const range = Array.from(Array(50).keys()).map(v => v + 1);

// Pass the predicate to filter()

const filtered = range.filter(predicate);

// filtered = [ 20, 24, 28, 30, 32, 36, 40, 42, 44, 48 ]


