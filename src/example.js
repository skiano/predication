
import { and, or, not } from './';
import { $_, $gt, $mod } from './';

const p1 = and($_({x: $gt(5)}),
               $_({y: $gt(5)}));

console.log(p1({x: 13, y: 10}));

const p2 = and($mod(2),
               $mod(3),
               or($gt(50),
                  not($gt(20))));

console.log(p2(60))