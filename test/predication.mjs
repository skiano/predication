import assert from 'assert';
import { predication } from '../predication.min.mjs';

export default [
  {
    name: 'simple',
    execute() {
      const a = predication({lt: 5, mod: 2});
      assert(a(3), 'simple: left true');
      assert(a(6), 'simple: right true');
      assert(!a(7), 'simple: neither true');

      const b = predication({this: 'foo', lt: 5, mod: 2});
      assert(b({foo: 3}), 'simple this: left true');
      assert(b({foo: 6}), 'simple this: right true');
      assert(!b({foo: 7}), 'simple this: neither true');
    }
  },
  {
    name: 'complex',
    execute() {
      const predicate = predication({
        and: [
          {lt: 15},
          {not: {lt: 5}},
          {or: [
            {mod: 2},
            {mod: 3}
          ]}
        ]
      });
      const values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
      const matches = values.filter(predicate);
      assert.deepEqual(matches,
        [ 6, 8, 9, 10, 12, 14 ],
        'filter: less than 15, and not less than 5, and divisible by either 2 or 3');
    }
  },
  {
    name: 'setting THIS',
    execute() {
      const a = predication({this: 'foo', eq: true});

      assert.equal(a({foo: true}), true, 'one level deep: true');
      assert.equal(a({foo: false}), false, 'one level deep: false');

      const b = predication({this: 'foo.bar', eq: true});

      assert.equal(b({foo: {bar: true}}), true, 'multiple levels deep: true');
      assert.equal(b({foo: {bar: false}}), false, 'multiple levels deep: false');
      assert.equal(b({foo: false}), false, 'multiple levels deep: undefined');

      const c = predication({
        and: [{this: 'foo.bar', eq: 1}, {this: 'foo.baz', eq: 1}]
      });

      assert.equal(c({foo: {bar: 1, baz: 1}}), true, 'depth + logic: true');
      assert.equal(c({foo: {bar: 1, baz: 2}}), false, 'depth + logic: false');
      assert.equal(c({foo: {baz: 1}}), false, 'depth + logic: undefined');

      const d = predication({
        this: 'foo',
        and: [{this: 'bar', eq: 1}, {this: 'baz', eq: 1}]
      });

      assert.equal(d({flarb: true, foo: {bar: 1, baz: 1}}), true, 'depth + logic + scope: true');

      const p1 = predication({this: 'foo.bar[-0]', eq: true});

      assert.equal(p1({foo: {bar: [false, true]}}), true, 'logic: object access');
      assert.equal(p1({foo: {bar: [true, false]}}), false, 'logic: object access');

      const p2 = predication({
        this: 'foo',
        or: [
          {this: 'bar', eq: true},
          {this: 'baz', eq: true}
        ]
      });

      assert.equal(p2({foo: {bar: true, baz: false}}), true, 'logic: object deep access');
      assert.equal(p2({foo: {baz: true}}), true, 'logic: object deep access or');
      assert.equal(p2({foo: {baz: false, bar: false}}), false, 'logic: object deep access or false');
    }
  },
  {
    name: 'setting THAT',
    execute() {
      const predicate = predication({this: 'foo', eq: {that: 'bar'}});

      assert.equal(predicate({foo: true, bar: true}), true, 'this equals that');
      assert.equal(predicate({foo: true, bar: false}), false, 'this does not equal that');

      const compare = predication({this: 'foo', gt: {that: 'bar'}});

      assert.equal(compare({foo: 10, bar: 3}), true, 'this > that true');
      assert.equal(compare({foo: 10, bar: 13}), false, 'this > that false');
    }
  },
  {
    name: 'missing',
    execute() {
      const predicate = predication({not: {this: 'missing', eq: true}});
      assert.equal(predicate({}), false, 'logic: missing this');
    }
  },
  {
    name: 'bad predicates',
    execute() {
      assert.throws(() => predication({bar: 2}), /Unregisterd predicate: "bar"/, 'throws on bad operators');
      assert.throws(() => predication({}), /Empty predicate/, 'throws on empty operators');
      assert.throws(() => predication({and: []}), /Empty logic/, 'throws on empty "and"');
      assert.throws(() => predication({or: []}), /Empty logic/, 'throws on empty "or"');
    }
  }
];

