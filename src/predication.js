import { evaluation } from './evaluation';
import { getPredicate } from './predicates';

// register operators
import './predicates/operators';

// register common predicates
import './predicates/common';

const removeValue = k => k !== 'this';
// const predicateCache = {};

export const predication = data => {
  // const cacheKey = JSON.stringify(data);
  // if (predicateCache[cacheKey]) return predicateCache[cacheKey];

  const getter = data.hasOwnProperty('this') ? evaluation(data.this) : undefined;

  const raw = getPredicate('or', Object.keys(data).filter(removeValue).map(key => {
    if (key === 'not') return getPredicate('not', predication(data[key]))
    if (key === 'and') return getPredicate('and', data[key].map(d => predication(d)));
    if (key === 'or') return getPredicate('or', data[key].map(d => predication(d)));
    return getPredicate(key, data[key]);
  }));

  const predicate = v => {
    v = getter ? getter(v) : v;
    return v === undefined ? undefined : raw(v);
  }

  // predicateCache[cacheKey] = predicate;
  // console.log(predicateCache);

  return predicate;
}
