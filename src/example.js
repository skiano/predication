
import { and, or, not } from './';

const $in = value => arr => Array.contains(arr, value);
const $nin = value => arr => !Array.contains(arr, value);
const $ne = value => key => key !== value;
const $eq = value => key => key === value;
const $lt = value => key => key < value;
const $lte = value => key => key <= value;
const $gt = value => key => key > value;
const $gte = value => key => key >= value;
const $mod = (divisor, remainder) => v => v % divisor === (remainder || 0);

const $_ = (predicates) => model => {
  for (let key in predicates) {
    if (predicates.hasOwnProperty(key)) {
      if (!predicates[key](model[key])) return false;
    }
  }
  return true;
}

const p1 = and($_({x: $gt(5)}),
               $_({y: $gt(5)}));

console.log(p1({x: 13, y: 10}));

const p2 = and($mod(2),
               $mod(3),
               or($gt(50),
                  not($gt(20))));

console.log(p2(60))