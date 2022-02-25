import { getPredicate } from './registration.mjs';
import { error } from './helpers.mjs'

const truthy = () => true;
const removeThis = k => k !== 'this';
const IS_CHILD = true;

export const predication = (config, isChild = false) => {
  const keys = Object.keys(config).filter(removeThis);
  const key = keys[0];
  const thisVal = config.this;

  let predicate;
  let childPredication;

  switch (true) {
    case keys.length > 1:
      /** this object has multiple predicates, so join them by or */
      childPredication = k => predication({[k]: config[k]}, IS_CHILD);
      predicate = getPredicate('or', keys.map(childPredication), thisVal);
      break;

    case key === 'and' || key === 'or':
      if (config[key].length === 0) error('Empty logic')
      childPredication = c => predication(c, IS_CHILD);
      predicate = getPredicate(key, config[key].map(childPredication), thisVal);
      break;

    case key === 'not':
      predicate = getPredicate(key, predication(config[key], IS_CHILD), thisVal);
      break;

    default:
      predicate = getPredicate(key, config[key], thisVal);
  }

  /*
   * for the root predicate, 
   * convert undefined to false so it is a true predicate
   * (inside, undefined is used to designate missing values, which helps with "not")
   */
  return isChild ? predicate : v => !!predicate(v);
}
