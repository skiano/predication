
function useInterpreter(operand, interpreter) {
  return v => interpreter[operand[0]](v, ...operand.slice(1));
}

const LOGICAL_OPERATORS = /^(!|&&|\|\|)$/;

function dataToJs(statement, interpreter, commands) {
  const operator = statement[0];
  const operands = statement.slice(1);

  switch (true) {
    case (operator === '!'):
      return `!c[${commands.push(useInterpreter(operands[0], interpreter)) - 1}](v)`;

    case (operator === '&&' || operator === '||'):
      return `(${operands
        .map(statement => {
          if (LOGICAL_OPERATORS.test(statement[0])) {
            return dataToJs(statement, interpreter, commands);
          } else {
           return `c[${commands.push(useInterpreter(statement, interpreter)) - 1}](v)`;
          }
        }).join(` ${operator} `)})`;

    default:
      throw new Error('unrecognized operator: ' + operator);

  }
}

export default function makeAONPredicate(statement, interpreter) {
  const c = []; // var name is important because it relates to the generated code
  return (v) => eval(dataToJs(statement, interpreter, c));
}
