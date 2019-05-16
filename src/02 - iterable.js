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

function log (iterab) {
  const iterat = iterable[Symbol.iterator]()
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    console.log(value)
  }
}

log(iterable)

for (const counter of iterable) {
  console.log(counter)
}

Array.from(iterable)

const [a, b, c] = iterable

console.log(a)
console.log(b)
console.log(c)

// const [a] = iterable
