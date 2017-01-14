
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

export default function makeAONPredicate(statement, interpreter) {
  const c = []; // var name is important because it relates to the generated code
  return (v) => eval(dataToJs(statement, interpreter, c));
}
