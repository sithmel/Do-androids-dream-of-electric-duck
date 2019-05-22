/* eslint-env node, mocha */
const { assert } = require('chai')

const getIterator = () => ({
  c: 0,
  next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
})

const iterable = {
  [Symbol.iterator]: getIterator
}

function run (iterab, func) {
  const iterat = iterab[Symbol.iterator]()
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    func(value)
  }
}

function runFor (iterab, func) {
  for (const item of iterab) {
    func(item)
  }
}

describe('iterable', () => {
  it('returns a sequence', () => {
    assert.deepEqual(Array.from(iterable), [0, 1, 2])
  })

  it('can be destructured', () => {
    const [a, b, c] = iterable
    assert.equal(a, 0)
    assert.equal(b, 1)
    assert.equal(c, 2)
  })

  it('can be iterated over with a function', () => {
    let arr = []
    run(iterable, (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })

  it('can be iterated over with for..of', () => {
    let arr = []
    runFor(iterable, (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })
})
