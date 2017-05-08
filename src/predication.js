import { evaluation, getPredicate } from './';

/* register operators and common predicates */
import './predicates/operators';
import './predicates/common';

// const predicateCache = {};

const removeValue = k => k !== 'this';

export const predication = config => {
  // const cacheKey = JSON.stringify(config);
  // if (predicateCache[cacheKey]) return predicateCache[cacheKey];

  const predicate = getPredicate('or', Object.keys(config).filter(removeValue).map(key => {
    const c = config[key];
    if (key === 'not') return getPredicate('not', predication(c), c.this);
    if (key === 'and') return getPredicate('and', c.map(predication), c.this);
    if (key === 'or') return getPredicate('or', c.map(predication), c.this);
    return getPredicate(key, c, c.this);
  }), config.this);

  // predicateCache[cacheKey] = predicate;
  // console.log(predicateCache);

  return predicate;
}
