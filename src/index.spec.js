import test from 'tape';

test('timing test', t => {
  t.plan(2);

  t.equal(typeof Date.now, 'function');

  const start = Date.now();

  setTimeout(function () {
    t.equal(Date.now() - start, 100);
  }, 1000);
});