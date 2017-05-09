export const and = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    if (!predicates[p](v)) return false;
  }
  return true;
};

export const or = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    if (predicates[p](v)) return true;
  }
  return false;
};

/** undefined should be false, not reversed! */
export const not = predicate => v => predicate(v) === false ? true : false;

export const isString = v => typeof v === 'string';

export const strIncludes = (v, c) => c.toLowerCase().includes(v.toLowerCase());
export const includes = (v, c) => isString(c) ? strIncludes(v, c) : c.includes(v);

export const mod = (v, c) => v % c === 0;
export const modR = (v, [denom, remainder]) => v % denom === remainder;

export const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && !Array.isArray(obj) && type !== 'function' && !!obj;
};

export const objectIncludesString = (o, c) => {
  if (isString(o) && strIncludes(c, o)) {
    return true;
  } else if (isDictionary(o)) {
    // no map because so break as soon as possible
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        if (objectIncludesString(o[k], c)) return true;
      }
    }
    return false;
  } else if (Array.isArray(o)) {
    // no map because so break as soon as possible
    for (let i = 0; i < o.length; i += 1) {
      if (objectIncludesString(o[i], c)) return true;
    }
    return false;
  } else {
    return false;
  }
};
