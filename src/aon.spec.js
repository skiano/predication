
import test from 'tape';
import aon from './aon';

test('And Operator', t => {
  t.plan(5);

  const interpreter = {
    bool: (model, value) => value
  }

  t.equal(aon(
    ['&&', ['bool', true], ['bool', true], ['bool', true]],
    interpreter)(), true, 'And(true, true, true) === true');

  t.equal(aon(
    ['&&', ['bool', false], ['bool', false], ['bool', false]],
    interpreter)(), false, 'And(false, false, false) === false');

  t.equal(aon(
    ['&&', ['bool', false], ['bool', true], ['bool', true]],
    interpreter)(), false, 'And(false, true, true) === false');

  t.equal(aon(
    ['&&', ['bool', true], ['bool', true], ['bool', false]],
    interpreter)(), false, 'And(true, true, false) === false');

  t.test('And: Eagerness', st => {
    st.plan(1);

    let count = 0;
    const countInterpreter = {
      bool: (model, value) => {
        count += 1;
        return value;
      }
    }

    aon(['&&', ['bool', true], 
      ['bool', false], ['bool', true]], 
      countInterpreter)();

    st.equal(count, 2, 'And bails on first falsy predicate()');
  })
});

test('Or Operator', t => {
  t.plan(4);

  const interpreter = {
    bool: (model, value) => value
  }

  t.equal(aon(
    ['||', ['bool', true], ['bool', true], ['bool', true]],
    interpreter)(), true, 'Or(true, true, true) === true');

  t.equal(aon(
    ['||', ['bool', false], ['bool', false], ['bool', true]],
    interpreter)(), true, 'Or(false, false, true) === true');

  t.equal(aon(
    ['||', ['bool', false], ['bool', false], ['bool', false]],
    interpreter)(), false, 'Or(false, false, false) === false');

  t.test('Or: Eagerness', st => {
    st.plan(1);

    let count = 0;
    const countInterpreter = {
      bool: (model, value) => {
        count += 1;
        return value;
      }
    }

    aon(['||', ['bool', true], 
      ['bool', true], ['bool', true]], 
      countInterpreter)();

    st.equal(count, 1, 'Or bails on first truthy predicate()');
  });
});

test('Not Operator', t => {
  t.plan(2);

  const interpreter = {
    bool: (model, value) => value
  }

  t.equal(aon(
    ['!', ['bool', true]],
    interpreter)(), false, 'Not(true) === false');

  t.equal(aon(
    ['!', ['bool', false]],
    interpreter)(), true, 'Not(true) === false');
});

// TODO: Not opperator

test('Interpreter', t => {
  t.plan(4);

  const interpreter = {
    test: (model, a, b, c, d) => {
      t.deepLooseEqual([a, b, c, d], [1, 2, 3, 4], 'Should pass through operands as arguments');
      t.deepLooseEqual(model, {model: true}, 'Should pass the model to the predicate');
      return true;
    }
  }

  aon(['||', ['test', 1, 2, 3, 4]], interpreter)({model: true});

  const notInterpreter = {
    test: (model, a, b, c, d) => {
      t.deepLooseEqual([a, b, c, d], [1, 2, 3, 4], 'Should pass through operands as arguments');
      t.deepLooseEqual(model, {model: true}, 'Should pass the model to the predicate');
      return true;
    }
  }

  aon(['!', ['test', 1, 2, 3, 4]], interpreter)({model: true});  
});

test('Composition', t => {
  t.plan(1);

  const interpreter = {
    lessThan: (model, key, threshold) => {
      return model[key] < threshold;
    },
    divisibleBy: (model, key, modulus) => {
      return model[key] % modulus === 0;
    }
  }

  const data = ['&&', ['lessThan', 'v', 15],
                      ['!', ['lessThan', 'v', 5]],
                      ['||', ['divisibleBy', 'v', 2],
                             ['divisibleBy', 'v', 3]]];

  const predicate = aon(data, interpreter);
  const oneToFifteen = Array.from(Array(20).keys()).map(v => ({v: v + 1}));
  const matches = oneToFifteen.filter(predicate);

  t.deepLooseEqual(matches,
    [ { v: 6 }, { v: 8 }, { v: 9 }, { v: 10 }, { v: 12 }, { v: 14 } ],
    'filter: less than 15, and not less than 5, and divisible by either 2 or 3')
});

// TODO: Test how `this` is affected