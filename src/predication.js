import { getPredicate } from './predicates';
import { isDictionary } from './predicates/common';

/* register operators and common predicates */
import './predicates/operators';
import './predicates/common';

const removeValue = k => k !== 'this';
// const predicateCache = {};

export const predication = data => {
  // const cacheKey = JSON.stringify(data);
  // if (predicateCache[cacheKey]) return predicateCache[cacheKey];

  const predicate = getPredicate('or', Object.keys(data).filter(removeValue).map(key => {
    if (key === 'not') return getPredicate('not', predication(data[key]), data.this)
    if (key === 'and') return getPredicate('and', data[key].map(d => predication(d)), data.this);
    if (key === 'or') return getPredicate('or', data[key].map(d => predication(d)), data.this);
    return getPredicate(key, data[key], data.this);
  }));

  // predicateCache[cacheKey] = predicate;
  // console.log(predicateCache);

  return predicate;
}
