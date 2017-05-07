const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && type !== 'function' && !!obj;
};

const isString = v => typeof v === 'string';

const strIncludes = (v, c) => c.toLowerCase().includes(v.toLowerCase());
const includes = (v, c) => isString(c) ? strIncludes(v, c) : c.includes(v);

const mod = (v, c) => v % denom === 0;
const modR = (v, [denom, remainder = 0]) => v % denom === remainder;

const objectIncludesString = (o, c) => {
  for (let k in o) {
    const v = o[k];
    if (isString(v) && strIncludes(c, v)) {
      return true;
    } else if (Array.isArray(v)) {
      // no map because so break as soon as possible
      for (let i = 0; i < v.length; i += 1) {
        if (objectIncludesString(v[i])) return true;
      }
    } else if (isDictionary(v)) {
      if (objectIncludesString(v)) return true;
    } else {}
  }

  return false;
};

/**
  * will help predicate always return false when value cannot be matched
  * it is tricky when combining the not operator with includes processing empty values 
  */
export const missing = v => typeof v === 'undefined' ? missing : false;

export default {
  in:  c => v => missing(v) || includes(v, c),
  nin: c => v => missing(v) || !includes(v, c),
  eq:  c => v => missing(v) || v === c,
  ne:  c => v => missing(v) || v !== c,
  lt:  c => v => missing(v) || v < c,
  gt:  c => v => missing(v) || v > c,
  lte: c => v => missing(v) || v <= c,
  gte: c => v => missing(v) || v >= c,
  rng: c => v => missing(v) || v >= c[0] && v <= c[1],
  mod: c => v => missing(v) || Array.isArray(c) ? modR(v, c) : mod(v, c),
  oi:  c => v => missing(v) || isDictionary(v) ? objectIncludesString(v, c) : false,
  noi: c => v => missing(v) || isDictionary(v) ? !objectIncludesString(v, c) : false
}
