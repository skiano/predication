import { getPredicate } from './';
import { isDictionary } from './predicates';

/* register operators and common predicates */
import './predicates/operators';
import './predicates/common';

const removeThis = k => k !== 'this';

export const predication = (config) => {
  const thisVal = config.this;
  const keys = Object.keys(config).filter(removeThis);
  const key = keys[0];

  if (keys.length > 1)  {
    return getPredicate('or', keys.map(k => predication({[k]: config[k]})), thisVal);
  } else if (key === 'and' || key === 'or') {
    return getPredicate(key, config[key].map(predication), thisVal);
  } else if (key === 'not') {
    return getPredicate(key, predication(config[key]), thisVal);
  } else {
    return getPredicate(key, config[key], thisVal);
  }
}
