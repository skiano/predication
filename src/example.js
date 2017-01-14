
function dataToJs(data, commands) {
  if (data[0] === '!') {
    /*
     * Handle Not
     */
    return `!x[${commands.push(data[1]) - 1}](v)`;
  } else {
    /*
     * Handle And / Or
     */
    return `(${data.slice(1)
      .map(opperand => {
        if (Array.isArray(opperand)) {
          return dataToJs(opperand, commands);
        } else {
         return `x[${commands.push(opperand) - 1}](v)`;
        }
      }).join(` ${data[0]} `)})`;
  }
}

function makePredicate(data) {
  const x = [];
  return (v) => {
    return eval(dataToJs(data, x));
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


const data = ['&&', ['!', () => false], ['||', () => false, () => true]];

const dataData = ['&&', ['GREATER_THAN', 'cost', 50],
                        ['LESS_THAN', 'cost', 150],
                        ['||', ['DIVISIBLE_BY', 'cost', 2],
                               ['DIVISIBLE_BY', 'cost', 3]]]

const predicate = makePredicate(data);

console.log(predicate(60));
// console.log(predicate(61));