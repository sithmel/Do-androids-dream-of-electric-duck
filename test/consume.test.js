/* eslint-env node, mocha */
const { assert } = require('chai')

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

let started = false

function * oneTwo () {
  started = true
  try {
    yield 1
    yield 2
  } finally {
    started = false
  }
}

describe('consume iterable semantic', () => {
  beforeEach(() => {
    started = false
  })

  it('returns a sequence', () => {
    assert.deepEqual(Array.from(oneTwo()), [1, 2])
    assert.deepEqual(arrayFrom(oneTwo()), [1, 2])
  })

  it('Array.from calls return', () => {
    assert.isFalse(started)
    arrayFrom(oneTwo())
    assert.isFalse(started)
  })
})
