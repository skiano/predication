
function logicToJs(logic, commands) {
  const chunk = logic.slice(1)
                     .map(opperand => {
                        if (Array.isArray(opperand)) {
                          return logicToJs(opperand, commands);
                        } else {
                         return `(x[${commands.push(opperand)}])(v)`;
                        }
                      })
                     .join(` ${logic[0]} `);
  return `(${chunk})`;
}

function makePredicate(logic) {
  const x = [];
  return (v) => {
    return eval(logicToJs(logic, x));
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

const logic = ['&&', x => x > 50,
                     x => x < 150,
                     ['||', x => x % 2 === 0,
                            x => x % 3 === 0]]

const predicate = makePredicate(logic);

console.log(predicate(60));
console.log(predicate(61));