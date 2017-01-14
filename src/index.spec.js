import test from 'tape';
import aon from './';

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

test('Interpreter', t => {
  t.plan(4);

  const interpreter = {
    test: (model, a, b, c, d) => {
      t.deepLooseEqual([a, b, c, d], [1, 2, 3, 4], 'should pass through operands as arguments');
      t.deepLooseEqual(model, {model: true}, 'should pass the model to the predicate');
      return true;
    }
  }

  aon(['||', ['test', 1, 2, 3, 4]], interpreter)({model: true});

  const notInterpreter = {
    test: (model, a, b, c, d) => {
      t.deepLooseEqual([a, b, c, d], [1, 2, 3, 4], 'should pass through operands as arguments');
      t.deepLooseEqual(model, {model: true}, 'should pass the model to the predicate');
      return true;
    }
  }

  aon(['!', ['test', 1, 2, 3, 4]], interpreter)({model: true});  
});

// TODO: Test how `this` is affected

