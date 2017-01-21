import { and, or, not } from 'and-or-not';
import { 
  $in, $nin,
  $ne, $eq,
  $lt, $lte,
  $gt, $gte,
  $mod 
} from 'and-or-not';

export default function aon(data) {
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
  $and: wrap((...predicates) => and(...predicates.map(aon))),
  $or: wrap((...predicates) => or(...predicates.map(aon))),
  $not: wrap(predicate => not(aon(predicate))),
  $in: wrap($in),
  $nin: wrap($nin),
  $ne: wrap($ne),
  $eq: wrap($eq),
  $lt: wrap($lt),
  $lte: wrap($lte),
  $gt: wrap($gt),
  $gte: wrap($gte),
  $mod: wrap($mod)
}
