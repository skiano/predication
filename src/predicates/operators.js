import { registerPredicate } from './';

const and = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    if (!predicates[p](v)) return false;
  }
  return true;
};

const or = predicates => v => {
  let p;
  for (p = 0; p < predicates.length; p += 1) {
    console.log(predicates);
    if (predicates[p](v)) return true;
  }
  return false;
};

/** undefined should be false, not reversed! */
const not = predicate => v => predicate(v) === false ? true : false;

registerPredicate('not', or);
registerPredicate('and', and);
registerPredicate('or', or);
