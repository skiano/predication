import test from 'tape'
import { predication } from '../'

test('validation', (t) => {
  t.plan(1)

  t.throws(() => {
    predication({ exists: 1 })()
  }, /invalid config for "exists": 1/, 'exists requires boolean')
})