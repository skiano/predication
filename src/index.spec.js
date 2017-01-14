import test from 'tape';
import aon from './';

test('And Operator', t => {
  t.plan(4);

  const interpreter = {
    bool(model, value) {
      return value;
    }
  }

  const bool = aon(
    ['&&', ['bool', true], ['bool', true], ['bool', true]],
    interpreter)();

  t.equal(bool, true, 'And: (true, true, true) => true');
});