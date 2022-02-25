import chalk from 'chalk';
import assert from 'assert';
import {
  evaluation,
  getPredicate,
  hasPredicate,
  listPredicates,
  predication,
  registerPredicate,
  removePredicate,
} from '../src/index.mjs';
import evaluationTests from './evaluation.mjs';

// The basic API
assert(evaluation instanceof Function, 'exports evaluation');
assert(predication instanceof Function, 'exports getPredicate');
assert(getPredicate instanceof Function, 'exports getPredicate');
assert(hasPredicate instanceof Function, 'exports getPredicate');
assert(listPredicates instanceof Function, 'exports getPredicate');
assert(removePredicate instanceof Function, 'exports getPredicate');
assert(registerPredicate instanceof Function, 'exports getPredicate');

// The basic Predicates
assert.deepEqual(listPredicates(), [
  'not',    'and', 'or',
  'exists', 'mod', 'in',
  'nin',    'eq',  'ne',
  'lt',     'gt',  'lte',
  'gte',    'rng', 'oi',
  'noi'
], 'exports default predicates');

const suites = [
  evaluationTests
];

console.log('\nRUNNING TESTS\n');

let failures = 0;
suites.forEach((suite) => {
  suite.forEach((test) => {
    try {
      test.execute();
      console.log(chalk.green(`✓ ${test.name}`));
    } catch (err) {
      console.log(chalk.redBright(`✗ ${test.name} failed!\n`));
      console.log(err);
      failures++;
    }
  });
});

if (failures) {
  console.log(`\nTESTS FAILED: ${failures}\n`);
  process.exit(1);
} else {
  console.log(`\nTESTS PASSED\n`);
}
