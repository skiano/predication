
import { and, or, not, createAndOrNot } from './';

var def = ["OR", {x: 2}, {y: 3}, ["AND", {foo: true}, {bar: false}]];

const opperators = {
  AND: and,
  OR: or,
  NOT: not
};

function dataToPredicate(def) {
  console.log(def);
  return function checkFunction(model) {
    for (let key in def) {
      if (def.hasOwnProperty(key)) {
        return def[key] === model[key];
      }
    }
  }
}

function compilePredicate(def, interpreter) {
  return (value) => {
    return opperators[def[0]](...def.slice(1).map(term => {
      if (Array.isArray(term)) {
        return compilePredicate(term);
      } else {
        return interpreter(term);
      }
    }))(value);
  }
}


const predicate = compilePredicate(def, dataToPredicate);

console.log(predicate({x: 1, y: 3}));

// .forEach(fn => {
//   console.log(fn({x: 1, y: 3});
// }));
