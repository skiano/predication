
import { createAndOrNot } from './';

const { predicateFromArray } = createAndOrNot(err => {
  console.log(err)
});


// and interpreter takes a term and returns a predicate
// the predicate recieves a value and returns true or false
// this is super sketchy and handles no failures
// maybe typescript and interfaces would help with this

function makeInterpreter(config) {
  return function interpreter(term) {
    if (!term.hasOwnProperty('type') || !config[term.type]) {
      throw new Error('Bad Type');
    } else {
      return config[term.type].interpreter(term);
    }
  }
}


const interpreter = makeInterpreter({
  RANGE: {
    /*
     * Example
     * {
     *   type: 'RANGE',
     *   key: 'size',
     *   range: [0, 100]
     * }
     */
    type: 'RANGE',
    vallidate(term) {
      return Array.isArray(term.range) && term.range.length === 2;
    },
    interpreter(term) {
      const { range, key } = term;
      return function predicate(value) {
        return range[0] <= value[key] && range[1] >= value[key];
      }
    }
  }
});


var config = [ "AND", { type: 'RANGE', key: 'size', range: [0, 10] },
                      { type: 'RANGE', key: 'size', range: [5, 15] }];

const predicate = predicateFromArray(config, interpreter);

let i = 0;
while (i < 150) {
  if (predicate({size: i})) console.log(i);
  i += 1;
}

