# predication

Predication uses javascript objects to describe predicates. That way you can store these descriptions as data and easily convert them into functions. Out of the box it supports common predicates and logical operators, and you can extend it by registering your own predicates.

Predication takes a **description** and returns a **predicate**. So it looks like this

```javascript
import predication from 'predication';

const isTrue = predication({eq: true});

isTrue(true); // true
isTrue(false); // false
```

That example is sort of silly, but here is a more complicated description that matches numbers less than 15, and not less than 5, and divisible by either 2 or 3.

```javascript
import predication from 'predication';

const description = {
  and: [
    {lt: 15},
    {not: {lt: 5}},
    {or: [
      {mod: 2},
      {mod: 3}
    ]}
  ]
};

const predicate = predication(description);

const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

const matches = values.filter(predicate); // [6,8,9,10,12,14]
```


In the above examples, `eq`, `mod`, and `lt` are examples of built-in predicate names. Here is the full list:

| Name | Example | Explanation |
| :--  | :------ | :---------- |
| `eq` | `{eq: true}` | value equals true |
| `in` | `{in: [1, 2, 3]}` | value is included in array  |
| `in` | `{in: 'abc'}` | value includes string 'abc' (case-insensitive) |

### A few quick examples

Here is an example of the simplest type of predicate. This one returns true for values greater than 3.

```javascript
{gt: 3});
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

## The predicate description

The predicate description is an object literal with key/value pairs that specify predicates and their configuration.

### Example descriptions

| Description | Explanation | Matches | Doesn’t match |
| :---------  | :---------- | :------ | :------------ |
| `{lt: 5}` | Less than 5 | `3` | `5` |
| `{and: [{mod: 2}, {gte: 10}]}` | Divisible by 2 AND Greater than or equal to 10 | `12` | `11` |


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
