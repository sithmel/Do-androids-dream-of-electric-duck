## Do androids dream of electric duck?

![A mechanican duck](./imgs/mechanical-duck.jpg "A mechanican duck")

---
![A book](./imgs/book.jpg "A book")

Note: Welcome to my session,
has anybody here ever watched "Blade Runner" or read "Do androids dream of electric sheep?"
please raise your hands.
Well for those who have not, let me tell you a spoiler-free introduction.
---
<!-- .slide: data-background="./imgs/andy-kelly-402111-unsplash.jpg" -->
Note: Set in a dystopian future, most of human beings have left Earth for other planets. They managed the hardness of these unhospitable colonies with the help of humanoid replicants.
The main character is a bounty hunter whose mission is to find and "retire" renegade androids, hidden on the post-apocalyptic earth.
---
Note: Androids development is now so advanced that the latest Nexus model is indistinguishable from authentic human beings. Some of them feature memory implants and are not aware of being synthetic humanoids.
Bounty hunters are able to recognise androids administering them the Voight-Kampff empathy test. Asking questions designed to elicit a emotional response, like for example:

"You're watching TV. Suddenly you realise there's a wasp crawling on your arm. You..."

But even this test is not 100% reliable with the latest Nexus model.
---
### Fake or authentic?
Note: It is a commonplace to say that the work of Philip K. Dick is centrally concerned with the question of what is real.
"Do androids dream of electric sheep" looks at a particular branch of this question. What is fake ?
And if you can make a fake seems to be authentic enough, does it matter ?
---
### Data authenticity?
Note: Reading the book I realised that as engineers we have our own Voight-Kampff tests.
We use it to determine what a piece of data is.
We are not really concerned about authenticity but we want to know if a piece of data respects an interface: if it has a specific set of attributes and methods.
This is about separating data and process.
And data needs to be fit for a the process:
---
### What is a order?
```js
function getTotal(order) {
  return order.getProductPrice() * order.quantity
}
```
Note: In the previous example I don't care what is "order" as soon as it support the method "getProductPrice" and attribute "quantity".
---
### polymorphism
We call this property polymorphism.

polymorphism is a very powerful mechanism we can leverage to generalise algorithms that work across different type of objects. We use it a lot in testing. Stubs Mocks and spies are fake objects, just real enough to pass the test.

Polymorphism, comes in different flavours.
In classical OOP different objects are based on one or more interfaces.
Every interface constitutes a contract: a promise to support a set of methods and attributes.

---
### Duck typing
Note: In dynamic languages (such as Python and Javascript), duck typing instead is widely used.

"If it walks like a duck and it quacks like a duck, then it must be a duck"

That translates in:
---
```js
function do(maybeDuck) {
  if (maybeDuck.walks && maybeDuck.quacks) {
    maybeDuck.walks();
    maybeDuck.quacks('I am a duck!');
    return;
  }
  // not a duck, doing something else of throw an error
}
```
Note: As we are not obsessed on hunting android ducks, we are happy if our duck is an android one.
For us is just as good as a real one.
---
### Sequences and polymorphism
```js
for (let i = 0; i < sequence.length; i++) {
  run(sequence[i])
}
```
Note: Now, think about the concept of sequence. Can you guess what type is this sequence?
Yes! it can be either a string or an array. But this is somewhat limiting.
---
### Abstracting a sequence
```js
for (let i = 0; i < 10; i++) {
  run(i)
}
```
Note: This piece of code returns a sequence of numbers from 0 to 9
This sequence can't be expressed by an array (although it can be saved in one).
We are not interested in accessing items of the sequence, in this case we are interested of the different values that "i" has over time
---
### Infinite sequence
```js
let i = 0
while (true) {
  run(i++)
}
```
Note: We are also not interested about its length. A sequence can be infinite:
And of course storing an infinite sequence in an array is both unfeasible and meaningless.
---
### iterables
```js
function * countTo (max = Infinity) {
  let i = 0
  while (i < max) {
    yield i++
  }
}

for (const item of countTo(10)) {
  run(item)
}
```
Note: ES2015 provides a way to abstract away the concept of sequence. It's called "iterable".
It allows to iterate over a sequence of numbers:
---

But also works with arrays and strings (and others):
```js
for (const item of [0, 10, 13, 5, 4]) {
  run(item)
}

for (const item of 'iterable') {
  run(item)
}
```
---
### Iterables advantages
Let's recap iterables advantage:
- you don't need to store a sequence in memory. They can be used to work on any amount of data.
- In some case are faster than array, because they don't allocate memory for new arrays when mapping/filtering
- they are part of the js api: Promise.all takes an iterable, spread operator takes an iterable, for .. of, Map/Set constructor takes iterables, and return iterables (keys, values methods).
- readable and elegant

There are also some disadvantages:
- some operation, that rely on having the data in memory is awkward: sorting, shuffling for example
- direct access using an index is not allowed

ES2018 gives us a way to abstract asynchronous sequences too. It is called asyncIterables.
They can be used for example with files and network resources.
```js
const stream = fs.createReadStream(filepath, { encoding: 'utf8' })
for await (const item of stream) {
  run(item)
}
```
From node 10, every stream is asyncIterable.

Compare this to:
```js
const stream = fs.createReadStream(filepath, {
  encoding: 'utf8'
});
stream.on('data', run);
```

Now we talked about the advantages of polymorphism and how this makes working with sequences easy and readable.
Let's take a closer look at iterables and asyncIterables. How do they work in detail?


The basic building blocks are the iterator/asyncIterator and iterable/asyncIterable interfaces. Let's start with the first.

An iterator is an object that implement a function next. And this function returns an object with this shape:
```js
{ value: 'the value returned', done: false }

{ done: true } // this signals that the sequence is exhausted
```
asyncIterators are similar but its next method returns a Promise that once resolved returns the same kind of objects.

Both iterator/asyncIterator can implement optional methods such as throw/return. We will have a look at return in a few paragraphs/slides.

Here's an example:
```js
const iterator = {
  c: 0,
  next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
}
```
for convenience we can build a function that return an iterator (so that we can reuse it multiple times):
```js
const getIterator = () => ({
  c: 0,
  next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
})
```
and we can use it in this way:
```js
function run (iterat, func) {
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    func(value)
  }
}

run(getIterator(), (item) => { console.log(item) })
```
and here is an example with an asyncIterator:
```js
const getAsyncIterator = () => ({
  c: 0,
  async next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
})

async function run (iterat, func) {
  while (true) {
    const { value, done } = await iterat.next()
    if (done) break
    func(value)
  }
}

run(getIterator(), (item) => { console.log(item) })
```

This pattern of generating a new iterator is very useful and it is part of the iterable/asyncIterable interface.

We can define as iterable an object that has a method named "Symbol.iterator" and this method returns an iterator.

```js
const iterable = {
  [Symbol.iterator]: getIterator
}
```
We can use this object like this:
```js
function run (iterab, func) {
  const iterat = iterab[Symbol.iterator]()
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    func(value)
  }
}

run(iterable, (item) => { console.log(item) })
```

But ES2015 gives us more convenient ways to consume an iterable.
```js
for (const value of iterable) {
  console.log(value)
}
```
Another way to consume iterables is using the spread operator:
```js
const [a, b] = iterable // only interested in the first 2 values
```
and of course, getting an array:
```js
const arr = Array.from(iterable)
// or
const arr2 = [...iterable]
```
All of this can also be used by regular strings and arrays because they ARE iterables.
```js
const arr = [1, 2, 3]
const str = 'hello'
Symbol.iterator in arr // true
Symbol.iterator in str // true
```

An async iterable is an object that has a method named "Symbol.asyncIterator" and this method returns an async iterator.

```js
const asyncIterable = {
  [Symbol.asyncIterator]: getAsyncIterator
}
```
This can be consumed like this:
```js
async function run (iterab, func) {
  const asyncIterat = iterab[Symbol.asyncIterator]()
  while (true) {
    const { value, done } = await asyncIterat.next()
    if (done) break
    func(value)
  }
}

run(asyncIterable, (item) => { console.log(item) })
```
Or more simply:
```js
for await (const value of asyncIterable) {
  console.log(value)
}
```
Pop quiz: how can you detect if an object provides the iterator or iterable interface ?
Have you noticed how we are using duck typing polymorphism for these 2 interfaces ?

---
The generator function
```js
function * generatorFunction () {
  yield 1
  yield 2
}

const generatorObject = generatorFunction()

for (const n of generatorObject) {
  console.log(n)
}
```
note: Building an iterable this way is a bit fiddly, but ES2015 gives us a language construct to build them easily.
Let's have a look at the details
---
```js
function * generatorFunction () {
  yield 1
  yield 2
}

const generatorObject = generatorFunction()

typeof generatorFunction === 'function'
typeof generatorObject === 'object'
```
Note: a generator function is a "function" and it returns a generator object and this very predictably is an "object".
---
Let me show how it works:
```js
function customGeneratorFunction () {
  let numberOfCalls = 0

  const obj = {
    [Symbol.iterator] () {
      return obj
    },
    next () {
      numberOfCalls++
      if (numberOfCalls > 2) {
        return { done: true }
      }
      return { value: numberOfCalls, done: false }
    }
  }
  return obj
}
```
Note: Here's the first surprise! a generator Object is an iterable and an iterator at the same time.
But there is more behind the scene that you should know
---
```js
function * generatorFunction () {
  // set up
  try {
    yield 1
    yield 2
  } finally {
    // tear down
  }
}
```
Note: A generator object is designed to set up and tear down its own environment.
The set up is lazy. It gets called only when the "next" method is called the first time.
The tear down is transformed in a method called "return" and should be always called, after finishing with the iterator. Note that the tear down is never invoked if the set up wasn't invoked.
---
```js
let started = false

function * generatorFunction () {
  started = true
  try {
    yield 1
    yield 2
  } finally {
    started = false
  }
}

const generatorObject = generatorFunction()
const iterator = generatorObject[Symbol.iterator]()
assert(started === false)

iterator.next()
assert(started === true)

iterator.return()
assert(started === false)

```
Note: let's test this.
---
```js
function generatorFunction () {
  let numberOfCalls = 0

  const obj = {
    [Symbol.iterator] () {
      return obj
    },
    next () {
      if (!numberOfCalls) {
        started = true
      }
      numberOfCalls++
      if (numberOfCalls > 2) {
        started = false
        return { done: true }
      }
      return { value: numberOfCalls, done: false }
    },
    return () {
      started = false
      return { done: true }
    }
  }
  return obj
}
```
Note: here's how a custom implementation looks like.
---
```js
function arrayFrom (iterable) {
  const array = []
  const iterator = iterable[Symbol.iterator]()
  try {
    while (true) {
      const { value, done } = iterator.next()
      if (done) break
      array.push(value)
    }
  } finally {
    if (iterator.return) iterator.return()
  }
  return array
}
```
Note: all native ES2015 methods (for..of, array.from, etc. ) support this semantic.
Here's a custom implementation of Array.from that closely mirrors the native one.
Note the duck typing style in "if (iterator.return) iterator.return()"
---
```js
async function * asyncGeneratorFunction () {
  started = true
  try {
    yield 1
    yield 2
  } finally {
    started = false
  }
}
```
Note: async generator functions and async generator objects are very similar the the regular ones.
With the only exception that they work with async iterables
---
```js
function asyncGeneratorFunction () {
  let numberOfCalls = 0

  const obj = {
    [Symbol.asyncIterator] () {
      return obj
    },
    async next () {
      if (!numberOfCalls) {
        started = true
      }
      numberOfCalls++
      if (numberOfCalls > 2) {
        started = false
        return { done: true }
      }
      return { value: numberOfCalls, done: false }
    },
    async return () {
      started = false
      return { done: true }
    }
  }
  return obj
}
```
---
```js
async function * readFromMongo (cfg) {
  let client = await getMongoClient(cfg)
  try {
    const db = client.db(cfg.db)
    const collection = db.collection(cfg.collection)
    const cursor = collection.find(cfg.query)
    while (await cursor.hasNext()) {
      yield cursor.next() // this returns a promise
    }
  } finally {
    client.close()
  }
}
```
Note: the set up and tear down phase are even more useful for async generator!
---
```js
for await (const item of readFromMongo({ ... })) {

}
```
---
```js
async function asyncArrayFrom (asyncIterable) {
  const array = []
  const iterator = asyncIterable[Symbol.asyncIterator]()
  try {
    while (true) {
      const { value, done } = await iterator.next()
      if (done) break
      array.push(value)
    }
  } finally {
    if (iterator.return) await iterator.return()
  }
  return array
}

// can only run in a function
const arr = await asyncArrayFrom(readFromMongo({ ... }))
```
Note:
---
```js
function flat(iterable) {
  for (const item of iterable) {
    if (Symbol.iterator in item && typeof item !== 'string'){
      yield * flat(item)
    } else {
      yield item
    }
  }
}
```
Note: yield *
---

```js
function bidi() {
  try {
    const value = yield
    yield value    
  } catch (e) {
    console.log(err.message)
  }
}

const iterat = bidi()[Symbol.iterator]
iterat.next('hello')
const { value } = iterat.next()
console.log(value)
// hello

const iterat = bidi()[Symbol.iterator]
iterat.throw(new Error('Oh No!'))
// Oh No!
```
