import { evaluation } from './';
import {
  or,
  and,
  not,
  mod,
  modR,
  error,
  includes,
  isBool,
  isOneOf,
  isArray,
  isNumber,
  isUndefined,
  isDictionary,
  isArrayOfLength,
  objectIncludesString
} from './helpers';

const predicates = {};
const validators = {};
const isMissing = (k, v, c) => k !== 'exists' && (isUndefined(c) || isUndefined(v));

export const listPredicates = () => Object.keys(predicates);
export const hasPredicate = key => predicates.hasOwnProperty(key);
export const removePredicate = key => {
  delete predicates[key];
  delete validators[key];
}

export const registerPredicate = (key, predicator, validator) => {
  if (hasPredicate(key)) {
    error(`Predicate "${key}" is already registered`);
  } else {
    validators[key] = validator
    predicates[key] = (config, value, getThis, getThat) => {
      const v = getThis(value);
      const c = getThat ? getThat(value) : config;

      if (isMissing(key, v, c)) return undefined;
      return predicator(v, c);
    }
  }
}

export const getPredicate = (key, config, thisValue) => {
  if (!hasPredicate(key)) {
    error(key ? `Unregisterd predicate: "${key}"` : 'Empty predicate');
  } else {
    if (validators[key] && !validators[key](config)) {
      error(`invalid config for "${key}": ${config}`)
    }
    const getThis = evaluation(thisValue);
    const getThat = isDictionary(config) && config.that && evaluation(config.that);
    return v => predicates[key](config, v, getThis, getThat);
  }
}

registerPredicate('not', not);
registerPredicate('and', and);
registerPredicate('or', or);

// add intersect 
// predication({ x: [3, 4, 5] })([1, 2, 3]) // true
// predication({ x: [4, 5, 6] })([1, 2, 3]) // false

registerPredicate('exists', (v, c) => c === !isUndefined(v), isBool)
registerPredicate('mod', (v, c) => (isArray(c) ? modR(v, c) : mod(v, c)), isOneOf(isNumber, isArrayOfLength(2)));
registerPredicate('in',  (v, c) => includes(v, c));
registerPredicate('nin', (v, c) => !includes(v, c));
registerPredicate('eq',  (v, c) => v === c);
registerPredicate('ne',  (v, c) => v !== c);
registerPredicate('lt',  (v, c) => v < c);
registerPredicate('gt',  (v, c) => v > c);
registerPredicate('lte', (v, c) => v <= c);
registerPredicate('gte', (v, c) => v >= c);
registerPredicate('rng', (v, c) => (v >= c[0] && v <= c[1]));
registerPredicate('oi',  (v, c) => objectIncludesString(v, c));
registerPredicate('noi', (v, c) => !objectIncludesString(v, c));
