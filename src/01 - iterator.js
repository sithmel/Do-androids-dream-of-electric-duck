const iterator = {
  c: 0,
  next () {
    if (this.c === 3) return { done: true }
    return { value: this.c++, done: false }
  }
}

// for (const counter of iterator) {
//   console.log(counter)
// }
function log (iterat) {
  while (true) {
    const { value, done } = iterat.next()
    if (done) break
    console.log(value)
  }
}

log(iterator)
