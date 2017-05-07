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

export default function predication(data, extraPs) {
  const getter = data.hasOwnProperty('by') ? by(data.by) : undefined;
  
  const predicate = or(Object.keys(data).filter(removeBy).map(key => {
    if (key === 'not') return not(predication(data[key], extraPs));
    if (key === 'and') return and(data[key].map(d => predication(d, extraPs)));
    if (key === 'or') return or(data[key].map(d => predication(d, extraPs)));
    if (predicates.hasOwnProperty(key)) return predicates[key](data[key]);
    if (extraPs && extraPs.hasOwnProperty(key)) return extraPs[key](data[key]);

    throw new Error(`Unkown predicate: ${key}`)
  }));

  return v => v === undefined ? false : predicate(getter ? getter(v) : v);
}
