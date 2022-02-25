import assert from 'assert';
import { predication } from '../src/index.mjs';

export default [
  {
    execute() {
      const sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
      const predicate = predication({ this: 'loves.length', lt: { that: 'hates.length' } })
      assert(predicate(sample), 'this.length is less than that.length')
    },
  },
  {
    execute() {
      const sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
      const predicate = predication({ this: 'loves.length', gt: { that: 'hates.length' } })
      assert(!predicate(sample), 'this.length is greater than that.length')
    },
  },
  {
    execute() {
      const sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
      const predicate = predication({ this: 'loves[0]', eq: { that: 'hates[0]' } })
      assert(predicate(sample), 'this[0] equals that[0]');
    },
  },
  {
    execute() {
      const sample = { loves: [1, 2, 3], hates: [1, 2, 3, 1] }
      const predicate = predication({ this: 'hates[-0]', eq: { that: 'loves[0]' } })
      assert(predicate(sample), 'this[0] equals that[0]')
    },
  },
  {
    execute() {
      const sample = { mind: { age: 60, iq: 100 } }
      const predicate = predication({ this: 'mind.age', lt: { that: 'mind.iq' } })
      assert(predicate(sample), 'age less than iq - true')
    },
  },
  {
    execute() {
      const sample = { mind: { age: 90, iq: 80 } }
      const predicate = predication({ this: 'mind.age', lt: { that: 'mind.iq' } })
      assert(!predicate(sample), 'age less than iq - false');
    },
  },
  {
    execute() {
      const sample = { stats: { apples: 20, oranges: 20 } }
      const predicate = predication({
        this: 'stats',
        and: [{ this: 'apples', eq: 20 } ] })
      assert(predicate(sample), 'apples equal 20 - true')
    },
  },
  {
    execute() {
      const sample = { stats: { apples: 20, oranges: 20 } }
      const predicate = predication({
        this: 'stats',
        or: [{ this: 'apples', eq: { that: 'oranges' } } ] })
      assert(predicate(sample), 'apples equal oranges - true')
    },
  }
];
