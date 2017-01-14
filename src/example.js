

const logic = ['&&', x => x > 50, 
                     x => x < 150,
                     ['||', x => x % 2 === 0,
                            x => x % 3 === 0]]

const predicate = makePredicate(logic);

console.log(predicate(60));


function logicToJs(logic) {
  const chunk = logic.slice(1)
                     .map(term => Array.isArray(term) ? 
                        logicToJs(term) : `(${term.toString()})(v)`)
                     .join(` ${logic[0]} `);
  return `(${chunk})`;
}

function makePredicate(logic) {
  return (v) => {
    return eval(logicToJs(logic));
  };
}