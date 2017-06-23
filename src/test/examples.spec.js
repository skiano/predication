import test from 'tape';
import { predication } from '../';

test('examples', (t) => {
  let sample
  let predicate

  t.plan(8)

  sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
  predicate = predication({ this: 'loves.length', lt: { that: 'hates.length' } })
  t.true(predicate(sample), 'this.length is less than that.length')

  sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
  predicate = predication({ this: 'loves.length', gt: { that: 'hates.length' } })
  t.false(predicate(sample), 'this.length is greater than that.length')

  sample = { loves: [1, 2, 3], hates: [1, 2, 3, 4] }
  predicate = predication({ this: 'loves[0]', eq: { that: 'hates[0]' } })
  t.true(predicate(sample), 'this[0] equals that[0]')

  sample = { loves: [1, 2, 3], hates: [1, 2, 3, 1] }
  predicate = predication({ this: 'hates[-0]', eq: { that: 'loves[0]' } })
  t.true(predicate(sample), 'this[0] equals that[0]')


  sample = { mind: { age: 60, iq: 100 } }
  predicate = predication({ this: 'mind.age', lt: { that: 'mind.iq' } })
  t.true(predicate(sample), 'age less than iq - true')

  sample = { mind: { age: 90, iq: 80 } }
  predicate = predication({ this: 'mind.age', lt: { that: 'mind.iq' } })
  t.false(predicate(sample), 'age less than iq - false')

  sample = { stats: { apples: 20, oranges: 20 } }
  predicate = predication({
    this: 'stats',
    and: [{ this: 'apples', eq: 20 } ] })
  t.true(predicate(sample), 'apples equal 20 - true')

  sample = { stats: { apples: 20, oranges: 20 } }
  predicate = predication({
    this: 'stats',
    or: [{ this: 'apples', eq: { that: 'oranges' } } ] })
  t.true(predicate(sample), 'apples equal oranges - true')
})
