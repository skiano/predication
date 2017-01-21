export function aon(data) {
  // TODO: handle evaluating a model
  const operator = Object.keys(data);
  return operators[operator[0]](data[operator]);
}

function wrap(operator) {
  return (operands) => {
    operands = Array.isArray(operands) ? operands : [operands];
    return operator(...operands);
  }
}

const operators = {
  $and: wrap((...predicates) => v => {
    for (let i in predicates) {
      if (!aon(predicates[i])(v)) return;
    }
    return true;
  }),

  $or: wrap((...predicates) => v => {
    for (let i in predicates) {
      if (aon(predicates[i])(v)) return true;
    }
    return false;
  }),

  $not: wrap(predicate => v => !aon(predicate)(v)),
  $in: wrap(value => arr => Array.contains(arr, value)),
  $nin: wrap(value => arr => !Array.contains(arr, value)),
  $ne: wrap(value => key => key !== value),
  $eq: wrap(value => key => key === value),
  $lt: wrap(value => key => key < value),
  $lte: wrap(value => key => key <= value),
  $gt: wrap(value => key => key > value),
  $gte: wrap(value => key => key >= value),
  $mod: wrap((divisor, remainder) => v => v % divisor === (remainder || 0))
}
