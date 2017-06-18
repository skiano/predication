import {
  error,
  isArray,
  isString,
  isFunction,
  isUndefined
} from './helpers'

const TERM_RE = /^([^\[]*)\[(\-?\d*)\]$/;
const IDX_RE = /^(\-?)(\d)$/;

const getAtIdx = (value, idx) => {
  if (isArray(value)) { return value[idx]; }
  if (isString(value)) { return value.charAt(idx); }
}

const indexer = str => {
  const [, reverse, idx] = IDX_RE.exec(str);
  return arr => getAtIdx(
    arr, (reverse ? arr.length - idx - 1 : idx)
  );
}

/** make identity fn once */
const identity = v => v;

/**
 * @param path {string} - path in object
 * example paths:
 *   "foo"
 *   "foo.bar"
 *   "foo[2]"
 *   "foo[-1]"
 *   "foo[2].bar"
 */
export const evaluation = path => {
  if (!path) return identity;
  if (!isString(path)) error(`bad access path: ${path}`);

  const terms = path.split('.').reduce((terms, frag) => {
    let parts = TERM_RE.exec(frag);
    if (parts) {
      return terms.concat(
        parts[1] ? [parts[1], indexer(parts[2])] : indexer(parts[2])
      )
    } else {
      return terms.concat([frag]);
    }
  }, []);

  if (terms.length === 0) return identity;

  return value => {
    if (isUndefined(value) || value === null) return undefined;

    let output = value;

    for (let i = 0; i < terms.length; i += 1) {
      if (isUndefined(output)) return undefined;
      output = isFunction(terms[i]) ? terms[i](output) : output[terms[i]];
    }

    return output;
  };
}