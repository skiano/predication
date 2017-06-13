/** undefined should be false, not reversed! */
export const not = (predicate, v) => predicate(v) === false ? true : false;
export const and = (predicates, v) => predicates.every(p => p(v));
export const or = (predicates, v) => predicates.some(p => p(v));

export const isString = v => typeof v === 'string';
export const strIncludes = (c, v) => c.toLowerCase().includes(v.toLowerCase());
export const includes = (c, v) => isString(c) ? strIncludes(c, v) : c.includes(v);

export const mod = (c, v) => v % c === 0;
export const modR = ([denom, remainder], v) => v % denom === remainder;

export const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && !Array.isArray(obj) && type !== 'function' && !!obj;
};

export const objectIncludesString = (str, o) => (
  (isString(o) && strIncludes(o, str)) ||
  (isDictionary(o) && Object.keys(o).some(k => objectIncludesString(str, o[k]))) ||
  (Array.isArray(o) && o.some(v => objectIncludesString(str, v))) ||
  false
);
