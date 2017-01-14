
import { and, or, not, predicateFromArray } from './';

function dataToPredicate(term) {
  return function predicate(model) {
    for (let key in term) {
      if (term.hasOwnProperty(key)) {
        return term[key] === model[key];
      }
    }
  }
}

var config = [ "AND", { x: 2 }, 
                      { y: 3 }, 
                      [ "OR", { foo: true }, 
                              { bar: true }]];

const predicate = predicateFromArray(config, dataToPredicate);

console.log(predicate({x: 2, y: 3, bar: false})); // true

