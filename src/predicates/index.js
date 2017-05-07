const predicates = {};

export const listPredicates = () => Object.keys(predicates);
export const hasPredicate = key => predicates.hasOwnProperty(key);
export const removePredicate = key => delete predicates[key];

export const registerPredicate = (key, predicator, validator) => {
  if (hasPredicate(key)) {
    throw new Error(`Predicate "${key}" is already registered`);
  } else {
    predicates[key] = predicator;
  }
}

export const getPredicate = (key, config) => {
  if (!hasPredicate(key)) {
    throw new Error(`Unregisterd predicate: "${key}"`);
  } else {
    return predicates[key](config);
  }
}

/** exists is important for all predicates */
registerPredicate('exists', c => v => c === (typeof v === undefined));
