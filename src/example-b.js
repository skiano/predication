
import { and, or, not, createAndOrNot } from './';

const opperators = {
  AND: and,
  OR: or,
  NOT: not
};

function dataToPredicate(term) {
  return function predicate(model) {
    for (let key in term) {
      if (term.hasOwnProperty(key)) {
        return term[key] === model[key];
      }
    }
  }
}

function compilePredicate(config, interpreter) {
  return function predicate(value) {
    return opperators[config[0]](...config.slice(1).map(term => {
      if (Array.isArray(term)) {
        return compilePredicate(term, interpreter);
      } else {
        return interpreter(term);
      }
    }))(value);
  }
}

var config = [ "AND", { x: 2 }, 
                      { y: 3 }, 
                      [ "OR", { foo: true }, 
                              { bar: true }]];

const predicate = compilePredicate(config, dataToPredicate);

console.log(predicate({x: 2, y: 3, bar: true})); // true

