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

test('Logic: setting this', t => {
  t.plan(8);

  const a = predication({this: 'foo', eq: true});

  t.equal(a({foo: true}), true, 'one level deep: true');
  t.equal(a({foo: false}), false, 'one level deep: false');

  const b = predication({this: 'foo.bar', eq: true});

  t.equal(b({foo: {bar: true}}), true, 'multiple levels deep: true');
  t.equal(b({foo: {bar: false}}), false, 'multiple levels deep: false');
  t.equal(b({foo: false}), undefined, 'multiple levels deep: undefined');

  const c = predication({
    this: 'foo',
    and: [{this: 'bar', eq: true}, {this: 'baz', eq: true}]
  });

  t.equal(b({foo: {bar: true, baz: true}}), true, 'depth + logic: true');
  t.equal(b({foo: {bar: true, baz: false}}), false, 'depth + logic: false');
  t.equal(b({foo: {bar: true}}), undefined, 'depth + logic: undefined');

  // const p1 = predication({this: 'foo.bar[-0]', eq: true});
  // t.equal(p1({foo: {bar: [false, true]}}), true, 'logic: object access');
  // t.equal(p1({foo: {bar: [true, false]}}), false, 'logic: object access');

  // const p2 = predication({
  //   this: 'foo',
  //   or: [
  //     {this: 'bar', eq: true},
  //     {this: 'baz', eq: true}
  //   ]
  // })
  // t.equal(p2({foo: {bar: true, baz: false}}), true, 'logic: object deep access');
  // t.equal(p2({foo: {baz: true}}), true, 'logic: object deep access or');
  // t.equal(p2({foo: {baz: false, bar: false}}), false, 'logic: object deep access or false');
});

// test('Logic: setting that', t => {
//   t.plan(4);

//   const predicate = predication({this: 'foo', eq: {that: 'bar'}});

//   t.equal(predicate({foo: true, bar: true}), true, 'this equals that');
//   t.equal(predicate({foo: true, bar: false}), false, 'this does not equal that');

//   const compare = predication({this: 'foo', gt: {that: 'bar'}});

//   t.equal(compare({foo: 10, bar: 3}), true, 'this > that true');
//   t.equal(compare({foo: 10, bar: 13}), false, 'this > that false');
// });

// test('Logic: missing', t => {
//   t.plan(1);
//   // const predicate = predication({not: {this: 'missing', eq: true}});
//   const predicate = predication({not: {this: 'missing', eq: true}});
//   t.equal(predicate({}), false, 'logic: missing this');
// });

// test('Logic: bad predicate', t => {
//   t.plan(1);
//   t.throws(() => predication({bar: 2}), /Unregisterd predicate: "bar"/, 'throws on bad operators');
// });
