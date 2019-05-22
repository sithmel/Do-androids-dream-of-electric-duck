/* eslint-env node, mocha */
const { assert } = require('chai')

async function arrayFrom (asyncIterable) {
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

let started = false

async function * oneTwo () {
  started = true
  try {
    yield 1
    yield 2
  } finally {
    started = false
  }
}

describe('consume async iterable semantic', () => {
  beforeEach(() => {
    started = false
  })

  it('returns a sequence', async () => {
    assert.deepEqual(await arrayFrom(oneTwo()), [1, 2])
  })

  it('Array.from calls return', async () => {
    assert.isFalse(started)
    await arrayFrom(oneTwo())
    assert.isFalse(started)
  })
})
