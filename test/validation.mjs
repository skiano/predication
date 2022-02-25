import assert from 'assert';
import { predication } from '../src/predication.mjs';

export default [
  {
    name: 'validation',
    execute() {
      assert.throws(() => {
        predication({ exists: 1 })
      }, /invalid config for "exists": 1/, 'exists requires boolean');
    
      /** if using "that", validates the value and returns undefined if bad */
      const bool = predication({ exists: { that: 'foo' } })({ foo: 'bad' });
      assert(!bool, 'fails silently on that values that are invalid');
    }
  }
];