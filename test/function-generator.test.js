/* eslint-env node, mocha */
const { assert } = require('chai')

let started = false

function * oneTwoFuncGen () {
  started = true
  try {
    yield 1
    yield 2
  } finally {
    started = false
  }
}

function oneTwoCustom () {
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

for (const oneTwo of [oneTwoFuncGen, oneTwoCustom]) {
  describe('function generator', () => {
    it('generator function is a function', () => {
      assert.typeOf(oneTwo, 'function')
    })

    it('generator object is an object', () => {
      assert.equal(typeof oneTwo(), 'object')
    })

    it('generator object is iterable', () => {
      const genObj = oneTwo()
      assert.isTrue(Symbol.iterator in genObj)
    })

    it('generator object is an iterator', () => {
      const genObj = oneTwo()
      assert.isTrue('next' in genObj)
    })

    it('generator object iterable returns itself', () => {
      const genObj = oneTwo()
      assert.equal(genObj, genObj[Symbol.iterator]())
    })
  })

  describe('return semantic', () => {
    beforeEach(() => {
      started = false
    })

    it('returns a sequence', () => {
      assert.deepEqual(Array.from(oneTwo()), [1, 2])
    })

    it('only starts when we start consuming it', () => {
      assert.isFalse(started)
      const iterator = oneTwo()[Symbol.iterator]()
      assert.isFalse(started)
      const { value } = iterator.next()
      assert.isTrue(started)
      assert.equal(value, 1)
    })

    it('Array.from calls return', () => {
      assert.isFalse(started)
      Array.from(oneTwo())
      assert.isFalse(started)
    })

    it('for..of calls return', () => {
      assert.isFalse(started)
      for (const item of oneTwo()) {
        assert.equal(item, 1)
        break
      }
      assert.isFalse(started)
    })

    it('spread operator calls return', () => {
      assert.isFalse(started)
      const [ a ] = oneTwo()
      assert.equal(a, 1)
      assert.isFalse(started)
    })
  })
}
