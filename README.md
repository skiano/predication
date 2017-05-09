# predication

Predication uses javascript objects to describe predicates. That way you can store these descriptions as data and easily convert them into functions.

### Examples

Here is an example of the simplest type of predicate. This one returns true for values greater than 3.

```javascript
import predication from 'predication';

const predicate = predication({gt: 3});
predicate(4); // true
predicate(0); // false
```
Here is a more complicated example. This one returns true for numbers less than 15, and not less than 5, and divisible by either 2 or 3.

```javascript
import predication from 'predication';

const data = {
  and: [
    {lt: 15},
    {not: {lt: 5}},
    {or: [
      {mod: 2},
      {mod: 3}
    ]}
  ]
};

const predicate = predication(data);

const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const matches = values.filter(predicate); // [6,8,9,10,12,14]
```
If you need to to deal with filtering a list of objects, you can specify `this` values. The following returns true for objects with a foo property that equals 5;

```javascript
const data = {this: 'foo', eq: 5};
const predicate = predication(data);

predicate({foo: 5}); // true
predicate({foo: 7}); // false
predicate({bar: true}); // false
```


```

predication({eq: true})

predication({this: 'foo', eq: true})

predication({this: 'foo.bar', eq: {that: 'foo.baz[-0]'}})

predication({this: 'foo.bar', exists: true});

predicate options can be numbers, strings, or arrays of numbers/strings

predication({this: 'foo.bar', exists: true});


import {
  predication,
  registerPredicate,
  isString
  isArray,
  isNumber,
  isBoolean
} from 'predication'



{
  and: [
    {this: 'foo', gt: 3}
  ]
}

update('and['foo'].gt', 5);

push('and['foo'].in', 5);
```
