const makeOperator = (logic) => {
  return (...predicates) => {
    const fn = [];
    const js = `!!(${predicates.map(p => (
      `fn[${fn.push(p) - 1}](v)`
    )).join(logic)})`;
    return v => eval(js);
  }
}

export const and = makeOperator('&&');
export const or = makeOperator('||');
export const not = predicate => v => !predicate(v);