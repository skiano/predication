import test from 'tape';
import predication from '../';

test('Logic', t => {
  t.plan(1);

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

  t.deepLooseEqual(matches,
    [ 6, 8, 9, 10, 12, 14 ],
    'filter: less than 15, and not less than 5, and divisible by either 2 or 3');
});

test('Logic Object Access', t => {
  t.plan(5);

  const p1 = predication({by: 'foo.bar[-0]', eq: true});
  t.equal(p1({foo: {bar: [false, true]}}), true, 'logic: object access');
  t.equal(p1({foo: {bar: [true, false]}}), false, 'logic: object access');

  const p2 = predication({
    by: 'foo',
    or: [
      {by: 'bar', eq: true},
      {by: 'baz', eq: true}
    ]
  })
  t.equal(p2({foo: {bar: true, baz: false}}), true, 'logic: object deep access');
  t.equal(p2({foo: {baz: true}}), true, 'logic: object deep access or');
  t.equal(p2({foo: {baz: false, bar: false}}), false, 'logic: object deep access or false');
});
