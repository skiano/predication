import { evaluation } from '../';

const predicates = {};

const isUndefined = v => typeof v === 'undefined';

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
      const getThat = isDictionary(config) && config.hasOwnProperty('that') ?
        evaluation(config.that) : () => config;

      return (value, getThis) => {
        const c = getThat(value);
        const v = getThis(value);
        // if (isUndefined(v) || isUndefined(c)) return undefined;
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
