/* eslint-env node, mocha */
const { assert } = require('chai')

const getIterator = () => ({
  c: 0,
  async next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
})

const iterable = {
  [Symbol.asyncIterator]: getIterator
}

async function run (iterab, func) {
  const asyncIterat = iterab[Symbol.asyncIterator]()
  while (true) {
    const { value, done } = await asyncIterat.next()
    if (done) break
    func(value)
  }
}

async function runFor (iterab, func) {
  for await (const item of iterab) {
    func(item)
  }
}

describe('async iterable', () => {
  it('can be iterated over with a function', async () => {
    let arr = []
    await run(iterable, (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })

  it('can be iterated over with for..of', async () => {
    let arr = []
    await runFor(iterable, (v) => {
      arr.push(v)
    })
    assert.deepEqual(arr, [0, 1, 2])
  })
})
