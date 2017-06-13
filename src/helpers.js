/** undefined should be false, not reversed! */
export const not = (v, predicate) => predicate(v) === false ? true : false;
export const and = (v, predicates) => predicates.every(p => p(v));
export const or = (v, predicates) => predicates.some(p => p(v));

export const isString = v => typeof v === 'string';
export const strIncludes = (v, c) => c.toLowerCase().includes(v.toLowerCase());
export const includes = (v, c) => isString(c) ? strIncludes(v, c) : c.includes(v);

export const mod = (v, c) => v % c === 0;
export const modR = (v, [denom, remainder]) => v % denom === remainder;

export const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && !Array.isArray(obj) && type !== 'function' && !!obj;
};

export const objectIncludesString = (o, str) => (
  (isString(o) && strIncludes(o, str)) ||
  (isDictionary(o) && Object.keys(o).some(k => objectIncludesString(o[k], str))) ||
  (Array.isArray(o) && o.some(v => objectIncludesString(v, str))) ||
  false
);
