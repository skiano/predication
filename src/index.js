
const makeOperator = (logic) => {
  return (...predicates) => {
    const c = [];

    const statement = `!!(${predicates.map((p) => (
      `c[${c.push(p) - 1}](v)`
    )).join(logic)})`;

    console.log(statement);

    return v => eval(statement);
  }
}

export const and = makeOperator('&&');
export const or = makeOperator('||');
export const not = predicate => v => !predicate(v);