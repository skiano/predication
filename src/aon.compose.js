
function createOperator(operator) {
  return v => console.log(operator, v);
}

function createAnd() {
  return createOperator('&&');
}

function createOr() {
  return createOperator('||');
}

function createNot() {
  return createOperator('!');
}

export { createAnd, createOr, createNot };

