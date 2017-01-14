import aon from './';

const data = ['&&', ['lessThan', 'v', 15],
                      ['!', ['lessThan', 'v', 5]],
                      ['||', ['divisibleBy', 'v', 2],
                             ['divisibleBy', 'v', 3]]];

const interpreter = {
  lessThan: (model, key, threshold) => {
    return model[key] < threshold;
  },
  divisibleBy: (model, key, modulus) => {
    return model[key] % modulus === 0;
  }
}

const predicate = aon(data, interpreter);

console.log(predicate({v: 6})); // true
console.log(predicate({v: 8})); // true
console.log(predicate({v: 9})); // true
console.log(predicate({v: 7})); // false
console.log(predicate({v: 3})); // false
console.log(predicate({v: 17})); // false