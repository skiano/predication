export const $_ = (predicates) => model => {
  for (let key in predicates) {
    if (predicates.hasOwnProperty(key)) {
      if (!predicates[key](model[key])) return false;
    }
  }
  return true;
}

export const $in = value => arr => Array.contains(arr, value);
export const $nin = value => arr => !Array.contains(arr, value);
export const $ne = value => key => key !== value;
export const $eq = value => key => key === value;
export const $lt = value => key => key < value;
export const $lte = value => key => key <= value;
export const $gt = value => key => key > value;
export const $gte = value => key => key >= value;
export const $mod = (divisor, remainder) => v => v % divisor === (remainder || 0);