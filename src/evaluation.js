import { isDictionary } from './predicates';

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
    const parts = TERM_RE.exec(frag);
    return parts ? terms.concat([parts[1], indexer(parts[2])]) : terms.concat([frag]);
  }, []);

  return value => {
    if (!isDictionary(value)) return undefined;
    if (terms.length === 0) return value;

    let output = value;

    for (let i = 0; i < terms.length; i += 1) {
      if (typeof output === 'undefined') return undefined;
      output = typeof terms[i] === 'function' ? terms[i](output) : output[terms[i]];
    }

    return output;
  };
}