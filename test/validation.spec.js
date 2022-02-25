import test from 'tape'
import { predication } from '../'

test('validation', (t) => {
  t.plan(2)

  t.throws(() => {
    predication({ exists: 1 })
  }, /invalid config for "exists": 1/, 'exists requires boolean')

  /** if using "that", validates the value and returns undefined if bad */
  const bool = predication({ exists: { that: 'foo' } })({ foo: 'bad' })
  t.false(bool, 'fails silently on that values that are invalid')
})