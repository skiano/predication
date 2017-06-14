# predication

Predication uses objects to describe predicates. That way you can store these descriptions as data and easily convert them into pre-compiled functions. This is useful if you need to store complicated predicates in a database or send them as a message, for example.

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

Predication takes a **description** and returns a **predicate**. So it looks like this...

```javascript
import { predication } from 'predication'

const isTrue = predication({eq: true})

isTrue(true)  // true
isTrue(false) // false
```

That example is sort of silly, but here is a more complicated description that matches numbers less than 15, and not less than 5, and divisible by either 2 or 3...

```javascript
import { predication } from 'predication'

const description = {
  and: [
    {lt: 15},
    {not: {lt: 5}},
    {or: [
      {mod: 2},
      {mod: 3}
    ]}
  ]
}

const predicate = predication(description)

const values = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

const matches = values.filter(predicate) // [6,8,9,10,12,14]
```

### Working with objects

In the likely event that your values are objects, you can use `this` to ‘key’ into the object...

```javascript
const predicate = predication({
  this: 'foo',
  eq: true
})

predicate({foo: true}})  // true
predicate({foo: false}}) // false
```

You can key into the object in more complicated ways. For example...

```javascript
const predicate = predication({
  this: 'foo.bar[0]',
  eq: true
})

predicate({foo: {bar: [true, false]}}) // true
predicate({foo: {bar: [false, true]}}) // false
```
You can also key into arrays starting from the end using negative indexing...

```javascript
const predicate = predication({
  this: 'foo.bar[-0]',
  eq: true
})

predicate({foo: {bar: [true, false]}}) // false
predicate({foo: {bar: [false, true]}}) // true
```

You can even specify relationships inside the object using `that`. Here is an example that matches objects whose `foo` and `bar` properties are the same...

```javascript
const predicate = predication({
  this: 'foo',
  eq: {that: 'bar'}
})

predicate({foo: true, bar: true})  // true
predicate({foo: true, bar: false}) // false
```

#### Nesting `this`

The strings provided for `this` will nest. Take, for example, Bobby and Marian...

```javascript
const Bobby = {
  body: {
    height: 60,
    age: 33
  }
}

const Marian = {
  body: {
    height: 49,
    age: 72
  }
}
```

If we wanted want to match people who are either taller than 50" or older than 65, we could do the following...

```javascript
const tall_or_old = predication({
  this: 'body',                 // <-- we select the body object
  or: [
    { this: 'height', gt: 50 }, // <-- we don't say body.height
    { this: 'age', gt: 45 }     // <-- we don't say body.age
  ]
})
```

Which would match both Bobby and Marian...

```javascript
tall_or_old(Bobby)  // true
tall_or_old(Marian) // true
```

### Registering your own predicates

If you want to add support for your own predicates, you can use `registerPredicate`. The following would add a predicate that returns `true` when a value has a given root, for example a square root...

```javascript
import { registerPredicate, predication } from 'predication'

const myHasRootPredicate = (config, value) => (
  (value > 0) && (config !== 0) && (Math.pow(value, (1 / config)) % 1 === 0)
)

registerPredicate('hasRoot', myHasRootPredicate)
```

Now that you have registered it, you can use `hasRoot` as a key in your descriptions...

```javascript
const hasSquareRoot = predication({
  hasRoot: 2
})

hasSquareRoot(4) // true
hasSquareRoot(7) // false
hasSquareRoot(9) // true
```
Because registerPredicate is used internally, you can take advantage of `this` and `that` for your predicates too...

```javascript
const fooHasCubeRoot = predication({
  this: 'foo',
  hasRoot: 3
})

fooHasCubeRoot({foo: 27}) // true
fooHasCubeRoot({foo: 9})  // false
```

### Built-in predicates

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

### A word about not and missing properties
