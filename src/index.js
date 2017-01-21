import { and, or, not } from 'and-or-not';
import { 
  $in, $nin,
  $ne, $eq,
  $lt, $lte,
  $gt, $gte,
  $mod, $_
} from 'and-or-not';

const operators = {
  $and: wrap((...predicates) => and(...predicates.map(predication))),
  $or: wrap((...predicates) => or(...predicates.map(predication))),
  $not: wrap(predicate => not(predication(predicate))),
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

export default function predication(data) {
  const keys = Object.keys(data);

  if (operators.hasOwnProperty(keys[0])) {
    return operators[keys[0]](data[keys]);
  } else {
    const predicated = {};
    keys.forEach(k => {
      predicated[k] = predication(data[k]);
    });
    return $_(predicated);
  }
}

function wrap(operator) {
  return (operands) => {
    return Array.isArray(operands) ?
      operator(...operands) : operator(operands);
  }
}
