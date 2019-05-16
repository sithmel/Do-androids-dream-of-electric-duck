/* eslint-env node, mocha */
const { assert } = require('chai')
const getIterator = () => ({
  c: 0,
  next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
})

function run (iterat, func) {
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    func(value)
  }
}

function runFor (iterat, func) {
  for (const item of iterat) {
    func(item)
  }
}

describe('iterator', () => {
  it('cannot return a sequence', () => {
    assert.deepEqual(Array.from(getIterator()), [])
  })

  it('cannot be destructured', () => {
    assert.throws(() => {
      const [a, b, c] = getIterator() // eslint-disable-line no-unused-vars
    }, 'getIterator is not a function or its return value is not iterable')
  })

  it('cannot be iterated over with for..of', () => {
    assert.throws(() => {
      runFor(getIterator(), () => {})
    }, 'iterat is not iterable')
  })

  it('can be iterated over with a function', () => {
    let arr = []
    run(getIterator(), (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })
})
