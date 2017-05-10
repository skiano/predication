# Predication

Predication uses javascript objects to describe predicates. That way you can store these descriptions as data and easily convert them into functions. Out of the box it supports common predicates and logical operators, and you can extend it by registering your own predicates.

## Installation

```bash
$ npm install predication
```

## Summary

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
If you are checking are trying to match objects, you can use `this` to specify what property you are interested in.

```javascript
const description = {this: 'foo.bar[0]', eq: true}
// matches the object: {foo: {bar: [true, false]}}
// does not match the object: {foo: {bar: [false, true]}}
```

You can even specify relationships inside the object using `that`

```javascript
const description = {this: 'foo', eq: {that: 'bar'}}
// matches the objects: {foo: true, bar: true} 
// does not match {foo: true, bar: false}
```
Both `this` and that use `evalutation`, which you can read about in more detail below.  

In the above examples, `eq`, `mod`, and `lt` are examples of built-in predicate names. Here is the full list:

## Common predicates

* **Modulo** 
  - `{mod: 2}` divisible by 2
  - `{mod: [3, 1]}` divisible by 3 with a remainder of 1
* **Includes**
  - `{in: 'apple'}` value includes string ‘apple’ (case-insensitive)
  - `{in: [1, 2, 3]}` value in array
* **Doesn’t Include**
  - `{nin: 'apple'}` value does not include ‘apple’ (case-insensitive)
  - `{nin: [1, 2, 3]}` value not in array
* **Equal** (deep equal)
  - `{eq: true}` value equals true
  - `{eq: 2}` value equals 2
* **Not Equal** 
  - `{ne: true}` value does not equal true
  - `{ne: 2}` value does not equal 2
* **Less Than**
  - `{lt: 10}`
* **Greater Than** 
  - `{gt: 10}`
* **Less Than or Equal**
  - `{lte: 10}`
* **Greater Than or Equal**
  - `{gte: 10}`
* **Range**
  - `{rng: [0, 10]}` greater than or equal to 0 AND less than or equal to 10
* **Object Includes**
  - `{oi: 'apple'}` any key in the object has a value that contains ‘apple’ (depth-first search and case-insensitive)
* **Object Doesn’t include**
  - `{noi: 'apple'}` opposite of `oi`

## A case study





