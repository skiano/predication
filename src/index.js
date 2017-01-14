
/*
 * Relevant Links
 * http://stackoverflow.com/questions/20737045/representing-logic-as-data-in-json
 * https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/
 * https://en.wikipedia.org/wiki/Predicate_(mathematical_logic)
 */

// TODO: Add unit tests
// TODO: make sure in unit tests that extra functions are not called
// TODO: async? observables?

const PREDICATE_ERROR = 'predicates must be functions';
const NOT_ERROR = 'not() requires exactly one argument';
const OPPERATOR_ERROR = 'Invalid opperator: ';

function createAndOrNot(errorHandler) {
  const callSafely = (fn, value) => {
    if (typeof fn !== 'function') {
      throw new Error(PREDICATE_ERROR);
    } else {
      try {
        return fn(value);
      } catch (err) {
        if (typeof errorHandler === 'function') {
          // allow user to handle the error
          // and pass them the original value
          return errorHandler(err, value);
        }
        return false;
      } 
    }
  }

  function and (...predicates) {
    return value => {
      for (let predicate of predicates) {
        if (!callSafely(predicate, value)) return false;
      }
      return true;
    };
  }

  function or(...predicates) {
    return value => {
      for (let predicate of predicates) {
        if (callSafely(predicate, value)) return true;
      }
      return false;
    };
  }

  function not(...predicates) {
    if (predicates.length > 1) throw new Error(NOT_ERROR);
    return value => {
      return !callSafely(predicates[0], value);
    }
  }

  const opperators = {
    AND: and,
    OR: or,
    NOT: not
  };

  function predicateFromArray(config, interpreter) {
    if (!Array.isArray(config) || !opperators[config[0]]) {
      throw new Error(OPPERATOR_ERROR + config[0]);
    }

    return value => {
      return opperators[config[0]](...config.slice(1).map(term => {
        if (Array.isArray(term)) {
          return predicateFromArray(term, interpreter);
        } else {
          return interpreter(term);
        }
      }))(value);
    }
  }

  return { and, or, not, predicateFromArray };
}

const { and, or, not, predicateFromArray } = createAndOrNot();

export {
  createAndOrNot,
  predicateFromArray,
  and,
  or,
  not
};
