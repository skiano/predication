import assert from 'assert';
import { evaluation } from '../src/index.mjs';

export default [
  {
    name: 'index 0',
    execute() { assert.equal(evaluation('bar[0]')({ bar: [0, 1, 2] }), 0); }
  },
  {
    name: 'index x',
    execute() { assert.equal(evaluation('bar[1]')({ bar: [0, 1, 2] }), 1); }
  },
  {
    name: 'index overflow',
    execute() { assert.equal(evaluation('bar[3]')({ bar: [0, 1, 2] }), undefined); }
  },
  {
    name: 'reverse index 0',
    execute() { assert.equal(evaluation('bar[-0]')({ bar: [0, 1, 2] }), 2); }
  },
  {
    name: 'reverse index x',
    execute() { assert.equal(evaluation('bar[-2]')({ bar: [0, 1, 2] }), 0); }
  },
  {
    name: 'reverse index overflow',
    execute() { assert.equal(evaluation('bar[-3]')({ bar: [0, 1, 2] }), undefined); }
  },
  {
    name: 'length',
    execute() { assert.equal(evaluation('length')('abc'), 3); }
  },
  {
    name: 'length deep',
    execute() { assert.equal(evaluation('foo.length')({ foo: 'abc' }), 3); }
  },
  {
    name: 'array length',
    execute() { assert.equal(evaluation('length')([1, 1, 1]), 3); }
  },
  {
    name: 'array length deep',
    execute() { assert.equal(evaluation('bar.length')({ bar: [1, 1, 1] }), 3); }
  },
  {
    name: 'index from array',
    execute() { assert.equal(evaluation('[1]')([1, 2, 3]), 2); }
  },
  {
    name: 'reverse index from array',
    execute() { assert.equal(evaluation('[-0]')([1, 2, 3]), 3); }
  },
  {
    name: 'index from string',
    execute() { assert.equal(evaluation('[1]')('boy'), 'o'); }
  },
  {
    name: 'reverse index from string',
    execute() { assert.equal(evaluation('[-1]')('girl'), 'r'); }
  },
  {
    name: 'by undefined',
    execute() { assert.equal(evaluation()(2), 2); }
  },
  {
    name: 'deep safety',
    execute() {
      const deep = evaluation('foo.bar[3]');
      assert.equal(deep(), undefined, 'missing object');
      assert.equal(deep({}), undefined, 'missing key: level 1');
      assert.equal(deep({foo: true}), undefined, 'missing key: level 2');
      assert.equal(deep({foo: {bar: true}}), undefined, 'missing key: bool');
      assert.equal(deep({foo: {bar: {baz: 2}}}), undefined, 'missing key: num');
      assert.equal(deep({foo: {bar: []}}), undefined, 'missing array value');
    }
  },
  {
    name: 'error handling',
    execute() {
      assert.throws(() => {
        evaluation(2)({bar: []});
      }, /bad access path/, 'throw on truthy non-strings');

      assert.throws(() => {
        evaluation('')({bar: []});
      }, /bad access path/, 'throw on empty');
    }
  }
];
