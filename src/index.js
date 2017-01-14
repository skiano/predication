
/*
 * Relevant Links
 * http://stackoverflow.com/questions/20737045/representing-logic-as-data-in-json
 * https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/
 * https://en.wikipedia.org/wiki/Predicate_(mathematical_logic)
 */

// TODO: Add unit tests
// TODO: make sure in unit tests that extra functions are not called
// TODO: 'predicate' should be called predicate

const PREDICATE_ERROR = 'predicates must be functions';
const NOT_ERROR = 'not() requires exactly one argument';

function createAndOrNot(errorHandler) {
  const callSafely = (fn, value) => {
    if (typeof fn !== 'function') {
      throw new Error(PREDICATE_ERROR);
    } else {
      try {
        return fn(value);
      } catch (err) {
        console.log(err)
        if (typeof errorHandler === 'function') {
          // allow user to handle the error
          // and pass them the original value
          return errorHandler(err, value);
        }
        return false;
      } 
    }
  }

  return {
    and(...predicates) {
      return value => {
        for (let predicate of predicates) {
          if (!callSafely(predicate, value)) return false;
        }
        return true;
      };
    },

    or(...predicates) {
      return value => {
        for (let predicate of predicates) {
          if (callSafely(predicate, value)) return true;
        }
        return false;
      };
    },

    not(...predicates) {
      if (predicates.length > 1) throw new Error(NOT_ERROR);
      return value => {
        return !callSafely(predicates[0], value);
      }
    },
  };
}

const { and, or, not } = createAndOrNot();

export { createAndOrNot, and, or, not };
