/** undefined should be false, not reversed! */
export const not = (v, predicate) => predicate(v) === false ? true : false;
export const and = (v, predicates) => predicates.every(p => p(v));
export const or = (v, predicates) => predicates.some(p => p(v));

export const checkType = typ => v => typeof v === typ
export const error = msg => { throw new Error(msg); }
export const isArray = v => Array.isArray(v)
export const isNotUndefined = v => !isUndefined(v)
export const isOneOf = (...predicates) => v => or(v, predicates)
export const isFunction = checkType('function')
export const isString = checkType('string');
export const isUndefined = checkType('undefined');
export const isNumber = checkType('number');
export const isBool = checkType('boolean');

export const isArrayOfLength = (len, validator) => v => (
  isArray(v) &&
  (v.length === len) &&
  (validator ? v.every(validator) : true)
)

export const strIncludes = (v, c) => v.toLowerCase().includes(c.toLowerCase());
export const includes = (v, c) => {
  if (isString(v)) return strIncludes(v, c)
  if (isArray(v)) return v.includes(c)
}

export const mod = (v, c) => v % c === 0;
export const modR = (v, [denom, remainder]) => v % denom === remainder;

export const isDictionary = obj => {
  const type = typeof obj;
  return type === 'object' && !isArray(obj) && type !== 'function' && !!obj;
};

export const objectIncludesString = (o, str) => (
  (isString(o) && strIncludes(o, str)) ||
  (isDictionary(o) && Object.keys(o).some(k => objectIncludesString(o[k], str))) ||
  (isArray(o) && o.some(v => objectIncludesString(v, str))) ||
  false
);
