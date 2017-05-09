import { getPredicate } from './';
import { isDictionary } from './predicates';

/* register operators and common predicates */
import './predicates/operators';
import './predicates/common';

const removeThis = k => k !== 'this';
const IS_CHILD = true;

export const predication = (config, isChild = false) => {
  const keys = Object.keys(config).filter(removeThis);
  const key = keys[0];
  const thisVal = config.this;

  let predicate;

  switch (true) {
    case keys.length > 1:
      /** this object has multiple predicates, so join them by or */
      predicate = getPredicate('or', keys.map(k => predication({[k]: config[k]}, IS_CHILD)), thisVal);
      break;

    case key === 'and' || key === 'or':
      /** and and or values must be converted to predicates */
      predicate = getPredicate(key, config[key].map(c => predication(c, IS_CHILD)), thisVal);
      break;

    case key === 'not':
      /** not value must be converted to predicate */
      predicate = getPredicate(key, predication(config[key], IS_CHILD), thisVal);
      break;

    default:
      /** get the predicate */
      predicate = getPredicate(key, config[key], thisVal);
  }

  /*
   * for the root predicate, 
   * convert undefined to false so it is a true predicate
   * (inside, undefined is used to designate missing values, which helps with "not")
   */
  return isChild ? predicate : v => !!predicate(v);
}
