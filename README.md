# predication

Predication uses objects to describe predicates. That way you can store these descriptions as data and easily convert them into functions. This is useful if you need to store them in a database or send them as a message for example.

It supports common predicates and logical operators out of the box, and you can register your own predicates.

## installation

### npm

```bash
$ npm install predication
```

### cdn

* https://unpkg.com/predication/dist/predication.js
* https://unpkg.com/predication/dist/predication.min.js

## usage

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
In the likely circumstance that the values you are checking are objects, you can use `this` to specify what property you are interested in.

```javascript
// match an object like {foo: {bar: [true]}}
const description = {this: 'foo.bar[0]', eq: true}
```

You can even specify relationships inside the object using `that`

```javascript
// match objects like {foo: true, bar: true} but not {foo: true, bar: false}
const description = {this: 'foo', eq: {that: 'bar'}}
```
If you want to add support for your own predicates it looks like this

```javascript
import { registerPredicate } from 'predication'

registerPredicate('hasRoot', (config, value) => (
  value > 0 &&
  config !== 0 &&
  Math.pow(value, (1 / config)) % 1 === 0
))

// create a predicate that matches 1, 4, 9, 16...
const hasSquareRoot = predication({
  hasRoot: 2 // 2 is the 'config' passed to your registered predicate
})

// your predicates can still use 'this' and 'that'
const fooHasCubeRoot = predication({ this: 'foo', hasRoot: 3 })
```

In the above examples, `eq`, `mod`, and `lt` are examples of built-in predicate names. Here is the full list:

| Name | Example | Explanation |
| :--  | :------ | :---------- |
| `eq` | `{eq: true}` | value equals true |
| `in` | `{in: [1, 2, 3]}` | value is included in array  |
| `in` | `{in: 'abc'}` | value includes string 'abc' (case-insensitive) |

```javascript
registerPredicate('not', not);
registerPredicate('and', and);
registerPredicate('or', or);

registerPredicate('mod', c => v => (Array.isArray(c) ? modR(v, c) : mod(v, c)));
registerPredicate('in',  c => v => includes(v, c));
registerPredicate('nin', c => v => !includes(v, c));
registerPredicate('eq',  c => v => v === c);
registerPredicate('ne',  c => v => v !== c);
registerPredicate('lt',  c => v => v < c);
registerPredicate('gt',  c => v => v > c);
registerPredicate('lte', c => v => v <= c);
registerPredicate('gte', c => v => v >= c);
registerPredicate('rng', c => v => (v >= c[0] && v <= c[1]));
registerPredicate('oi',  c => v => objectIncludesString(v, c));
registerPredicate('noi', c => v => !objectIncludesString(v, c));
```
