
// look into boolean algebra
// https://en.wikipedia.org/wiki/Boolean_algebra#Values
// might be useful to implement XOR and equivilence etc

function useInterpreter(operand, interpreter) {
  return v => interpreter[operand[0]](v, ...operand.slice(1));
}

const LOGICAL_OPPERATORS = /^(!|&&|\|\|)$/;

function dataToJs(statement, interpreter, commands) {
  const opperator = statement[0];
  const opperands = statement.slice(1);

  switch (true) {
    case (opperator === '!'):
      return `!c[${commands.push(useInterpreter(opperands[0], interpreter)) - 1}](v)`;

    case (opperator === '&&' || opperator === '||'):
      return `(${opperands
        .map(statement => {
          if (LOGICAL_OPPERATORS.test(statement[0])) {
            return dataToJs(statement, interpreter, commands);
          } else {
           return `c[${commands.push(useInterpreter(statement, interpreter)) - 1}](v)`;
          }
        }).join(` ${opperator} `)})`;

    default:
      throw new Error('unrecognized opperator: ' + opperator);

  }
}

function makePredicate(statement, interpreter) {
  const c = []; // commands
  return (v) => {
    console.log(dataToJs(statement, interpreter, c));
    return eval(dataToJs(statement, interpreter, c));
  };
}

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


// const data = ['!', ['greaterThan', 'value', 50]];
const data = ['||', ['greaterThan', 'value', 80], ['greaterThan', 'value', 60]];

const interpreter = {
  greaterThan(model, key, value) {
    return model[key] > value;
  },
  lessThan(model, key, value) {
    return model[key] < value;
  }
}

const predicate = makePredicate(data, interpreter);
console.log(predicate({value: 70}));
