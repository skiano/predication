import predicates, { isDictionary } from './predicates';
import {by} from './by';

const removeBy = k => k !== 'by';

const not = predicate => v => !predicate(v);

const and = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    if (!predicates[p](v)) return false;
  }
  return true;
};

const or = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    if (predicates[p](v)) return true;
  }
  return false;
};

export default function predication(data, customPredicates) {
  const getter = data.hasOwnProperty('by') ? by(data.by) : undefined;
  
  const predicate = or(Object.keys(data).filter(removeBy).map(key => {
    if (key === 'not') return not(predication(data[key], customPredicates));
    if (key === 'and') return and(data[key].map(d => predication(d, customPredicates)));
    if (key === 'or') return and(data[key].map(d => predication(d, customPredicates)));
    if (predicates.hasOwnProperty(key)) return predicates[key](data[key]);
    if (customPredicates && customPredicates.hasOwnProperty(key))
      return customPredicates[key](data[key]);

    throw new Error(`Unkown predicate: ${key}`)
  }));

  return v => v === undefined ? false : predicate(getter ? getter(v) : v);
}
