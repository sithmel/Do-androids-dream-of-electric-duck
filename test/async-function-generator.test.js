/* eslint-env node, mocha */
const { assert } = require('chai')

let started = false

async function * oneTwoFuncGen () {
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

for (const oneTwo of [oneTwoFuncGen, oneTwoCustom]) {
  describe('async function generator', () => {
    it('generator function is a function', () => {
      assert.typeOf(oneTwo, 'function')
    })

    it('generator object is async-iterable', () => {
      const genObj = oneTwo()
      assert.isTrue(Symbol.asyncIterator in genObj)
    })

    it('generator object is an async iterator', () => {
      const genObj = oneTwo()
      assert.isTrue('next' in genObj)
    })

    it('generator object async iterable returns itself', () => {
      const genObj = oneTwo()
      assert.equal(genObj, genObj[Symbol.asyncIterator]())
    })
  })

  describe('async function generator return semantic', () => {
    beforeEach(() => {
      started = false
    })

    it('only starts when we start consuming it', async () => {
      assert.isFalse(started)
      const iterator = oneTwo()[Symbol.asyncIterator]()
      assert.isFalse(started)
      const { value } = await iterator.next()
      assert.isTrue(started)
      assert.equal(value, 1)
    })

    it('for await ..of calls return', async () => {
      assert.isFalse(started)
      for await (const item of oneTwo()) {
        assert.equal(item, 1)
        break
      }
      assert.isFalse(started)
    })
  })
}
