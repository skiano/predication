import { evaluation } from './';
import {
  or,
  and,
  not,
  mod,
  modR,
  includes,
  isDictionary,
  objectIncludesString
} from './helpers';

const predicates = {};

const isUndefined = v => typeof v === 'undefined';
const isMissing = (k, v, c) => k !== 'exists' && (isUndefined(c) || isUndefined(v));

export const listPredicates = () => Object.keys(predicates);
export const hasPredicate = key => predicates.hasOwnProperty(key);
export const removePredicate = key => delete predicates[key];

export const registerPredicate = (key, predicator, validator) => {
  if (hasPredicate(key)) {
    throw new Error(`Predicate "${key}" is already registered`);
  } else {
    predicates[key] = (config, value, getThis, getThat) => {
      const v = getThis(value);
      const c = getThat ? getThat(value) : config;

      if (isMissing(key, v, c)) return undefined;
      return predicator(c, v);      
    }
  }
}

export const getPredicate = (key, config, thisValue) => {
  if (!hasPredicate(key)) {
    throw new Error(`Unregisterd predicate: "${key}"`);
  } else {
    const getThis = evaluation(thisValue);
    const getThat = isDictionary(config) && config.that && evaluation(config.that);
    return v => predicates[key](config, v, getThis, getThat);
  }
}

registerPredicate('exists', (c, v) => c === (typeof v !== 'undefined'));

registerPredicate('not', not);
registerPredicate('and', and);
registerPredicate('or', or);

registerPredicate('mod', (c, v) => (Array.isArray(c) ? modR(c, v) : mod(c, v)));
registerPredicate('in',  (c, v) => includes(c, v));
registerPredicate('nin', (c, v) => !includes(c, v));
registerPredicate('eq',  (c, v) => v === c);
registerPredicate('ne',  (c, v) => v !== c);
registerPredicate('lt',  (c, v) => v < c);
registerPredicate('gt',  (c, v) => v > c);
registerPredicate('lte', (c, v) => v <= c);
registerPredicate('gte', (c, v) => v >= c);
registerPredicate('rng', (c, v) => (v >= c[0] && v <= c[1]));
registerPredicate('oi',  (c, v) => objectIncludesString(c, v));
registerPredicate('noi', (c, v) => !objectIncludesString(c, v));
