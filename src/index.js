
/*
 * Relevant Links
 * http://stackoverflow.com/questions/20737045/representing-logic-as-data-in-json
 * https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/
 */

// TODO: Add unit tests
// TODO: make sure in unit tests that extra functions are not called

const CHECK_ERR = 'checks must be functions';
const NOT_ERROR = 'not() requires exactly one argument';

function createAndOrNot(errorHandler) {
  const callSafely = (fn, value) => {
    if (typeof fn !== 'function') {
      throw new Error(CHECK_ERR);
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
    and(...checks) {
      return value => {
        for (let check of checks) {
          if (!callSafely(check, value)) return false;
        }
        return true;
      };
    },

    or(...checks) {
      return value => {
        for (let check of checks) {
          if (callSafely(check, value)) return true;
        }
        return false;
      };
    },

    not(...checks) {
      if (checks.length > 1) throw new Error(NOT_ERROR);
      return value => {
        return !callSafely(checks[0], value);
      }
    },
  };
}

const { and, or, not } = createAndOrNot();

export { createAndOrNot, and, or, not };
