/* eslint-env node, mocha */
const { assert } = require('chai')

const getIterator = () => ({
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

describe('async iterator', () => {
  it('can be iterated over with a function', async () => {
    let arr = []
    await run(getIterator(), (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })
})
