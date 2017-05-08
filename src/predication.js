import { evaluation, getPredicate } from './';
import { isDictionary } from './predicates';

/* register operators and common predicates */
import './predicates/operators';
import './predicates/common';

// const predicateCache = {};

const removeThis = k => k !== 'this';

export const predication = config => {
  // const cacheKey = JSON.stringify(config);
  // if (predicateCache[cacheKey]) return predicateCache[cacheKey];
  const predicate = getPredicate('or', Object.keys(config).filter(removeThis).map(key => {
    if (key === 'not') return getPredicate('not', predication(config[key]), config.this);
    if (key === 'and') return getPredicate('and', config[key].map(predication), config.this);
    if (key === 'or') return getPredicate('or', config[key].map(predication), config.this);

    return getPredicate(key, config[key], config.this);
  }), config.this);

  // predicateCache[cacheKey] = predicate;
  // console.log(predicateCache);

  return predicate;
}
