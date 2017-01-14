
import aon from './';

const data = ['||', ['greaterThan', 'value', 80], ['greaterThan', 'value', 60]];

const interpreter = {
  greaterThan(model, key, value) {
    return model[key] > value;
  },
  lessThan(model, key, value) {
    return model[key] < value;
  }
}

const predicate = aon(data, interpreter);
console.log(predicate({value: 70}));

// TODO: handle ! not opperator
// change opperand to opperand
// how to take care of security
// right now this executes arbitrary functions
// i supose it needs to go al the way to the level of taking a data object??
// maybe even then it cant be safe
// maybe it is safe though because this creates the string
// its not as if it accepts a string as an arg and executes it


// const data = ['&&', ['!', () => false], ['||', () => false, () => true]];

// const dataData = ['&&', ['GREATER_THAN', 'cost', 50],
//                         ['LESS_THAN', 'cost', 150],
//                         ['||', ['DIVISIBLE_BY', 'cost', 2],
//                                ['DIVISIBLE_BY', 'cost', 3]]]
