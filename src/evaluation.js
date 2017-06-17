import { isDictionary } from './helpers';

const TERM_RE = /^([^\[]*)\[(\-?\d*)\]$/;
const IDX_RE = /^(\-?)(\d)$/;

const indexer = str => {
  const [, reverse, idx] = IDX_RE.exec(str);
  return arr => reverse ? arr[arr.length - idx - 1] : arr[idx];
}

/** make identity fn once */
const identity = v => v;

/*
 * path {string}
 * example paths:
 *   "foo"
 *   "foo.bar"
 *   "foo[2]"
 *   "foo[-1]"
 *   "foo[2].bar"
 */
export const evaluation = path => {
  if (!path) return identity;
  if (typeof path !== 'string') throw new Error(`bad access path: ${path}`);

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
    if (typeof value === 'undefined' || value === null) return undefined;

    let output = value;

    for (let i = 0; i < terms.length; i += 1) {
      if (typeof output === 'undefined') return undefined;
      output = typeof terms[i] === 'function' ? terms[i](output) : output[terms[i]];
    }

    return output;
  };
}