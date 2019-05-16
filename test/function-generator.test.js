/* eslint-env node, mocha */
const { assert } = require('chai')

function * funcGenerator(dbConfig, query) {
  const db = initDb(dbConfig)
  try {
    const reader = db(query)
    while (true) {
      const data = reader.get()
      if (data === undefined) {
        return
      }
      yield data
    }
  } finally {
    db.close()
  }
}

class funcGenerator2 {
  constructor(dbConfig, query) {
    this.dbConfig = dbConfig
    this.query = query
    this.initiated = false
  }

  [Symbol.iterator] () {
    return this
  }

  next () {
    let db, reader
    if (!this.initiated) {
      db = initDb(this.dbConfig)
      reader = db(this.query)
    }
    const data = reader.get()
    if (data === undefined) {
      return { done: true }
    }
    return { value: data, done: false }
  }

  return () {
    if (this.initiated) {
      this.db.close()
    }
  }
}

function funcGenerator3 (dbConfig, query) {
  let initiated = false
  let db, reader
  const obj = {
    [Symbol.iterator] () {
      return obj
    },
    next () {
      if (!initiated) {
        db = initDb(dbConfig)
        reader = db(query)
      }
      const data = reader.get()
      if (data === undefined) {
        return { done: true }
      }
      return { value: data, done: false }
    },
    return () {
      if (initiated) {
        db.close()
      }
    }
  }
  return obj
}

function consume(func) {
  for (const item of funcGenerator('gen', 'query')) {
    func(item)
  }
}

function consume2(func) {
  const iterator = funcGenerator('gen', 'query')[Symbol.iterator]()
  try {
    while (true) {
      const { value, done } = iterator
      if (done) break
      func(value)
    }
  } finally {
    if (iterator.return) iterator.return()
  }
}
