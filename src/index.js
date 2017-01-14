
// Note: for of loop allows breaks

/*
 * Relevant Links
 * http://stackoverflow.com/questions/20737045/representing-logic-as-data-in-json
 * https://hacks.mozilla.org/2015/04/es6-in-depth-iterators-and-the-for-of-loop/
 */

// TODO: Add unit tests
// TODO: make sure in unit tests that extra functions are not called

function createAndOrNot(errorHandler) {
  const handleError = (fn, x) => {
    if (typeof fn !== 'function') {
      throw new Error('checks must be functions');
    } else {
      try {
        return fn(x);
      } catch (e) {
        if (typeof errorHandler === 'function') {
          return errorHandler(e);
        }
        return false;
      } 
    }
  }

  return {

    and(...checks) {
      return value => {
        for (let check of checks) {
          if (!handleError(check, value)) return false;
        }
        return true;
      };
    },

    or(...checks) {
      return value => {
        for (let check of checks) {
          if (handleError(check, value)) return true;
        }
        return false;
      };
    },

    not(...checks) {
      if (checks.length > 1) {
        throw new Error('not() requires exactly one argument');
      } else {
        return !handleError(checks[0](x));  
      }
    },

  };
}

function test() {

}

const a = {
  b: 2
}
const {and, or, not} = createAndOrNot();

export { createAndOrNot, and, or, not };
