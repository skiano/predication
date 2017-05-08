import { evaluation } from '../';

const predicates = {};

const lenientPredicates = ['exists']; 
const isUndefined = v => typeof v === 'undefined';
const isMissing = (k, v, c) => !lenientPredicates.includes(k) && (isUndefined(c) || isUndefined(v));

export const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && !Array.isArray(obj) && type !== 'function' && !!obj;
};

export const listPredicates = () => Object.keys(predicates);
export const hasPredicate = key => predicates.hasOwnProperty(key);
export const removePredicate = key => delete predicates[key];

export const registerPredicate = (key, predicator, validator) => {
  if (hasPredicate(key)) {
    throw new Error(`Predicate "${key}" is already registered`);
  } else {
    predicates[key] = config => {
      const getThat = isDictionary(config) && config.that && evaluation(config.that);

      return (value, getThis) => {
        const v = getThis(value);
        const c = getThat ? getThat(value) : config;

        if (isMissing(key, v, c)) return undefined;
        return predicator(c)(v);
      }
    }
  }
}

export const getPredicate = (key, config, thisValue) => {
  if (!hasPredicate(key)) {
    throw new Error(`Unregisterd predicate: "${key}"`);
  } else {
    /** parse "this" into getter once **/
    const getThis = evaluation(thisValue);
    /** curry the getter into the predicate **/
    return v => predicates[key](config)(v, getThis);
  }
}

/** exists is important for all predicates */
registerPredicate('exists', c => v => c === (typeof v !== 'undefined'));
