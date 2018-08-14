export const PORT = 5765

export const map = fn => async function* (iterable) {
  let index = 0
  for await (let item of iterable) {
    yield fn(item, index++)
  }
}

export const genIterator = function (array, isAsync = false) {
  let iter = function * (array) {
    for (let item of array) {
      yield item
    }
  }
  if (isAsync) {
    return async function *() {
      yield * iter(array)
    }
  }
  return function *() {
    yield * iter(array)
  }
}
